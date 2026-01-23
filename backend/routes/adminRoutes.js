const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const AccountDeletionRequest = require('../models/AccountDeletionRequest');
const { protect } = require('../middleware/authMiddleware');
const { uploadWorkingPhotos, uploadGPLetters } = require('../middleware/workerUploadMiddleware');
const { sendStatusUpdateEmail } = require('../utils/emailService');

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

// @desc    Get all users (with optional status filter)
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { accountStatus: status } : {};
        // If query is for pending, we might want to also include the old 'isApproved: false' for back-compat if mixed data, 
        // but let's assume cleaner migration:

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get pending users (legacy/convenience route)
// @route   GET /api/admin/pending
// @access  Private/Admin
router.get('/pending', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({ accountStatus: 'pending' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body; // 'approved', 'rejected', or 'pending'
        const user = await User.findById(req.params.id);

        if (user) {
            const oldStatus = user.accountStatus;
            user.accountStatus = status;
            // Maintain isApproved for any legacy checks if needed, or remove if confident
            user.isApproved = status === 'approved';
            
            // Set rejection timestamp if rejected
            if (status === 'rejected') {
                user.rejectionTimestamp = new Date();
            } else {
                user.rejectionTimestamp = null;
            }

            await user.save();

            // Send email notification if status changed
            if (oldStatus !== status) {
                try {
                    await sendStatusUpdateEmail(user.email, user.fullName, status);
                    console.log(`Status update email sent to ${user.email} for status: ${status}`);
                } catch (emailError) {
                    console.error('Failed to send status update email:', emailError);
                    // Don't fail the status update if email fails
                }
            }

            res.json({ message: `User status updated to ${status}`, user });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get system activity (all service requests)
// @route   GET /api/admin/activity
// @access  Private/Admin
router.get('/activity', protect, adminOnly, async (req, res) => {
    try {
        const requests = await ServiceRequest.find({})
            .populate('requester', 'fullName email')
            .populate('worker', 'fullName email')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Deprecated approve route for backward compatibility (optional)
router.put('/approve/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            const oldStatus = user.accountStatus;
            user.accountStatus = 'approved';
            user.isApproved = true;
            await user.save();

            // Send email notification if status changed
            if (oldStatus !== 'approved') {
                try {
                    await sendStatusUpdateEmail(user.email, user.fullName, 'approved');
                    console.log(`Approval email sent to ${user.email}`);
                } catch (emailError) {
                    console.error('Failed to send approval email:', emailError);
                }
            }

            res.json({ message: `User approved` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all account deletion requests
// @route   GET /api/admin/deletion-requests
// @access  Private/Admin
router.get('/deletion-requests', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};
        
        const requests = await AccountDeletionRequest.find(query)
            .populate('user', 'fullName email role phone')
            .populate('reviewedBy', 'fullName email')
            .sort({ createdAt: -1 });
        
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve account deletion request
// @route   PUT /api/admin/deletion-requests/:id/approve
// @access  Private/Admin
router.put('/deletion-requests/:id/approve', protect, adminOnly, async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const request = await AccountDeletionRequest.findById(req.params.id).populate('user');
        
        if (!request) {
            return res.status(404).json({ message: 'Deletion request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request has already been processed' });
        }

        // Update request status
        request.status = 'approved';
        request.adminNotes = adminNotes || null;
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();
        await request.save();

        // Delete the user account
        await User.deleteOne({ _id: request.user._id });

        // Delete all deletion requests for this user
        await AccountDeletionRequest.deleteMany({ user: request.user._id });

        res.json({ 
            message: 'Account deletion request approved and user account deleted',
            request 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reject account deletion request
// @route   PUT /api/admin/deletion-requests/:id/reject
// @access  Private/Admin
router.put('/deletion-requests/:id/reject', protect, adminOnly, async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const request = await AccountDeletionRequest.findById(req.params.id);
        
        if (!request) {
            return res.status(404).json({ message: 'Deletion request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request has already been processed' });
        }

        request.status = 'rejected';
        request.adminNotes = adminNotes || null;
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();
        await request.save();

        res.json({ 
            message: 'Account deletion request rejected',
            request 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete user (admin direct deletion)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Delete any pending deletion requests
            await AccountDeletionRequest.deleteMany({ user: user._id });
            
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user details (Admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.nic = req.body.nic || user.nic;
            user.phone = req.body.phone || user.phone;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                role: updatedUser.role,
                isAdmin: updatedUser.role === 'admin',
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Upload working photos (Worker)
// @route   POST /api/admin/worker/working-photos
// @access  Private/Worker
router.post('/worker/working-photos', protect, uploadWorkingPhotos.array('photos', 10), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user || user.role !== 'worker') {
            return res.status(403).json({ message: 'Only workers can upload working photos' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Save full URLs with protocol and host
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fileUrls = req.files.map(file => `${baseUrl}/uploads/working-photos/${file.filename}`);
        user.workingPhotos = [...(user.workingPhotos || []), ...fileUrls];
        await user.save();

        res.json({ message: 'Working photos uploaded successfully', photos: fileUrls });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Upload GP letters (Worker)
// @route   POST /api/admin/worker/gp-letters
// @access  Private/Worker
router.post('/worker/gp-letters', protect, uploadGPLetters.array('letters', 10), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user || user.role !== 'worker') {
            return res.status(403).json({ message: 'Only workers can upload GP letters' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Save full URLs with protocol and host
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fileUrls = req.files.map(file => `${baseUrl}/uploads/gp-letters/${file.filename}`);
        user.gpLetters = [...(user.gpLetters || []), ...fileUrls];
        await user.save();

        res.json({ message: 'GP letters uploaded successfully', letters: fileUrls });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete working photo (Worker)
// @route   DELETE /api/admin/worker/working-photos/:filename
// @access  Private/Worker
router.delete('/worker/working-photos/:filename', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user || user.role !== 'worker') {
            return res.status(403).json({ message: 'Only workers can delete working photos' });
        }

        const filename = req.params.filename;
        const fs = require('fs');
        const path = require('path');
        
        // Find and remove the photo (handle both full URL and path formats)
        const photoToDelete = user.workingPhotos.find(photo => {
            if (photo.includes(filename)) {
                return true;
            }
            return false;
        });

        if (photoToDelete) {
            // Extract file path for deletion
            let filePath = photoToDelete;
            if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
                filePath = filePath.replace(/^https?:\/\/[^/]+/, '');
            }
            const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
            const fullFilePath = path.join(__dirname, '../uploads', relativePath);
            
            // Delete file from filesystem
            if (fs.existsSync(fullFilePath)) {
                try {
                    fs.unlinkSync(fullFilePath);
                    console.log('Deleted working photo file:', fullFilePath);
                } catch (err) {
                    console.error('Error deleting working photo file:', err);
                }
            }
        }
        
        // Remove from user's workingPhotos array
        user.workingPhotos = user.workingPhotos.filter(photo => !photo.includes(filename));
        await user.save();

        res.json({ message: 'Working photo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete GP letter (Worker)
// @route   DELETE /api/admin/worker/gp-letters/:filename
// @access  Private/Worker
router.delete('/worker/gp-letters/:filename', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user || user.role !== 'worker') {
            return res.status(403).json({ message: 'Only workers can delete GP letters' });
        }

        const filename = req.params.filename;
        const fs = require('fs');
        const path = require('path');
        
        // Find and remove the letter (handle both full URL and path formats)
        const letterToDelete = user.gpLetters.find(letter => {
            if (letter.includes(filename)) {
                return true;
            }
            return false;
        });

        if (letterToDelete) {
            // Extract file path for deletion
            let filePath = letterToDelete;
            if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
                filePath = filePath.replace(/^https?:\/\/[^/]+/, '');
            }
            const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
            const fullFilePath = path.join(__dirname, '../uploads', relativePath);
            
            // Delete file from filesystem
            if (fs.existsSync(fullFilePath)) {
                try {
                    fs.unlinkSync(fullFilePath);
                    console.log('Deleted GP letter file:', fullFilePath);
                } catch (err) {
                    console.error('Error deleting GP letter file:', err);
                }
            }
        }
        
        // Remove from user's gpLetters array
        user.gpLetters = user.gpLetters.filter(letter => !letter.includes(filename));
        await user.save();

        res.json({ message: 'GP letter deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
