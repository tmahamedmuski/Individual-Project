const express = require('express');
const router = express.Router();
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');
const { protect } = require('../middleware/authMiddleware');

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
        const { status } = req.body; // 'approved' or 'rejected'
        const user = await User.findById(req.params.id);

        if (user) {
            user.accountStatus = status;
            // Maintain isApproved for any legacy checks if needed, or remove if confident
            user.isApproved = status === 'approved';

            await user.save();
            res.json({ message: `User status updated to ${status}` });
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
            user.accountStatus = 'approved';
            user.isApproved = true;
            await user.save();
            res.json({ message: `User approved` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await User.deleteOne({ _id: user._id }); // Use deleteOne instead of remove
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

module.exports = router;
