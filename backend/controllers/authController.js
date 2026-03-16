const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OTP = require('../models/OTP');
const AccountDeletionRequest = require('../models/AccountDeletionRequest');
const { sendOTPEmail, sendRegistrationEmail, sendStatusUpdateEmail } = require('../utils/emailService');
const path = require('path');
const fs = require('fs');
const ActivityLog = require('../models/ActivityLog');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    console.log('[AuthController] Registration request received. Body keys:', Object.keys(req.body));
    console.log('[AuthController] Payload:', { email: req.body.email, role: req.body.role, nic: req.body.nic });
    try {
        // Parse JSON fields from req.body (multer adds them as strings)
        let { fullName, email, password, role, phone, location, nic, skills, address } = req.body;

        // If location is a string, parse it
        if (typeof location === 'string') {
            try {
                location = JSON.parse(location);
            } catch (e) {
                // If parsing fails, location might be undefined
            }
        }

        // If skills is a string, parse it
        if (typeof skills === 'string') {
            try {
                skills = JSON.parse(skills);
            } catch (e) {
                skills = [];
            }
        }

        if (!fullName || !email || !password || !phone || !nic) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists (email or NIC)
        const userExists = await User.findOne({
            $or: [{ email }, { nic }]
        });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists (Email or NIC)' });
        }

        // Handle file uploads
        const { isCloudinaryConfigured } = require('../middleware/uploadMiddleware');

        let nicPhotoPath = null;
        let workingPhotosPaths = [];
        let gpLettersPaths = [];

        // Helper to get formatted path or Base64 URI
        const getFormattedPath = (file, folder) => {
            if (isCloudinaryConfigured) return file.path;

            // Fallback: Convert memory buffer to Base64 data URI
            if (file.buffer) {
                const b64 = file.buffer.toString('base64');
                return `data:${file.mimetype};base64,${b64}`;
            }
            return null;
        };

        // Debug: Log what we received
        console.log('Files received:', {
            hasFile: !!req.file,
            hasFiles: !!req.files,
            filesKeys: req.files ? Object.keys(req.files) : [],
            files: req.files
        });

        // Handle NIC photo (single file or from fields)
        if (req.file) {
            nicPhotoPath = getFormattedPath(req.file, 'nic-photos');
            console.log('NIC photo Path:', nicPhotoPath);
        } else if (req.files && req.files.nicPhoto && req.files.nicPhoto.length > 0) {
            nicPhotoPath = getFormattedPath(req.files.nicPhoto[0], 'nic-photos');
            console.log('NIC photo Path:', nicPhotoPath);
        }

        // Handle working photos (for workers)
        if (req.files && req.files.workingPhotos && req.files.workingPhotos.length > 0) {
            workingPhotosPaths = req.files.workingPhotos.map(file => {
                const p = getFormattedPath(file, 'working-photos');
                console.log('Working photo Path:', p);
                return p;
            });
        }

        // Handle GP letters (for workers)
        if (req.files && req.files.gpLetters && req.files.gpLetters.length > 0) {
            gpLettersPaths = req.files.gpLetters.map(file => {
                const p = getFormattedPath(file, 'gp-letters');
                console.log('GP letter Path:', p);
                return p;
            });
        }

        // Log file paths for debugging
        console.log('=== Saving to Database ===');
        console.log('NIC Photo Path:', nicPhotoPath);
        console.log('Working Photos Paths:', workingPhotosPaths);
        console.log('GP Letters Paths:', gpLettersPaths);

        // Create user - ALWAYS save paths even if file check fails (multer saves files asynchronously)
        const user = await User.create({
            fullName,
            email,
            password,
            role: role || 'requester',
            phone,
            nic,
            location,
            skills: skills || [],
            nicPhoto: nicPhotoPath, // Save path even if file check failed
            workingPhotos: workingPhotosPaths,
            gpLetters: gpLettersPaths,
            accountStatus: 'pending', // Explicitly set status
            addedBy: req.body.addedBy || null, // Capture addedBy if present
        });

        console.log('User created with ID:', user._id);

        if (user) {
            try {
                await sendRegistrationEmail(user.email, user.fullName);
                console.log('Registration email sent to:', user.email);
            } catch (emailError) {
                console.error('Failed to send registration email:', emailError);
                // Don't fail registration if email fails
            }

            // Log Registration
            try {
                await ActivityLog.create({
                    user: user._id,
                    action: 'REGISTER',
                    description: `New user registered: ${user.fullName}`,
                    metadata: { role: user.role, email: user.email }
                });
            } catch (logError) {
                console.error('Failed to create activity log:', logError);
            }

            res.status(201).json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                phone: user.phone,
                nic: user.nic,
                location: user.location,
                nicPhoto: user.nicPhoto,
                // token: generateToken(user._id), // Do not login immediately
                message: 'Registration successful. Please wait for admin approval.',
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('[AuthController] Registration Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get users managed by the current user (Broker)
// @route   GET /api/auth/managed-users
// @access  Private
const getManagedUsers = async (req, res) => {
    try {
        const users = await User.find({ addedBy: req.user.id }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (user.accountStatus !== 'approved' && !user.isApproved) {
                return res.status(401).json({
                    message: user.accountStatus === 'rejected'
                        ? 'Your account has been rejected. Contact admin.'
                        : 'Account pending admin approval'
                });
            }

            // Log Login
            try {
                await ActivityLog.create({
                    user: user._id,
                    action: 'LOGIN',
                    description: `User logged in`,
                    metadata: { role: user.role, email: user.email }
                });
            } catch (logError) {
                console.error('Failed to create activity log for login:', logError);
            }

            res.json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                location: user.location,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { fullName, phone, location } = req.body;

        if (fullName) user.fullName = fullName;
        if (phone) user.phone = phone;
        if (location) user.location = location;

        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            location: updatedUser.location,
            accountStatus: updatedUser.accountStatus,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(400).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Request account deletion
// @route   POST /api/auth/request-deletion
// @access  Private
const requestAccountDeletion = async (req, res) => {
    try {
        const { reason } = req.body;
        const userId = req.user.id;

        // Check if user already has a pending request
        const existingRequest = await AccountDeletionRequest.findOne({
            user: userId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have a pending deletion request' });
        }

        // Create deletion request
        const deletionRequest = await AccountDeletionRequest.create({
            user: userId,
            reason: reason || 'No reason provided',
            status: 'pending'
        });

        res.status(201).json({
            message: 'Account deletion request submitted successfully. Admin will review your request.',
            request: deletionRequest
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user account (immediate - for admin or after approval)
// @route   DELETE /api/auth/delete
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            // Delete any pending deletion requests
            await AccountDeletionRequest.deleteMany({ user: user._id });

            // Ensure we log before deleting so we have the ID and name
            try {
                await ActivityLog.create({
                    user: null, // Since the user is being deleted, we set to null or keep ID as untracked
                    action: 'ACCOUNT_DELETION',
                    description: `User account deleted by user: ${user.fullName}`,
                    metadata: { role: user.role, email: user.email, deletedUserId: user._id }
                });
            } catch (logError) {
                console.error('Failed to log account deletion:', logError);
            }

            await user.deleteOne();
            res.json({ message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload NIC photo
// @route   POST /api/auth/nic-photo
// @access  Private
const uploadNICPhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // For Cloudinary, we just use the path from the cloud
        // For Local memory storage, we convert to Base64
        const { isCloudinaryConfigured } = require('../middleware/uploadMiddleware');
        let nicPhotoUrl;

        if (isCloudinaryConfigured) {
            nicPhotoUrl = req.file.path;
        } else {
            const b64 = req.file.buffer.toString('base64');
            nicPhotoUrl = `data:${req.file.mimetype};base64,${b64}`;
        }

        user.nicPhoto = nicPhotoUrl;
        await user.save();

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            nicPhoto: user.nicPhoto,
            message: 'NIC photo uploaded successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete NIC photo
// @route   DELETE /api/auth/nic-photo
// @access  Private
const deleteNICPhoto = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.nicPhoto) {
            // Handle both full URL and path formats
            let filePath = user.nicPhoto;

            // If it's a full URL, extract the path
            if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
                filePath = filePath.replace(/^https?:\/\/[^/]+/, '');
            }

            // Remove leading slash and construct full file path
            const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
            const fullFilePath = path.join(__dirname, '../uploads', relativePath);

            // Delete file from filesystem
            if (fs.existsSync(fullFilePath)) {
                try {
                    fs.unlinkSync(fullFilePath);
                    console.log('Deleted NIC photo file:', fullFilePath);
                } catch (err) {
                    console.error('Error deleting NIC photo file:', err);
                }
            }
        }

        // Remove NIC photo from user
        user.nicPhoto = null;
        await user.save();

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            nicPhoto: user.nicPhoto,
            message: 'NIC photo deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Request password reset - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if email exists or not for security
            return res.status(200).json({
                message: 'If an account exists with this email, an OTP has been sent.',
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTPs for this email
        await OTP.deleteMany({ email });

        // Save OTP to database
        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        // Send OTP email
        try {
            await sendOTPEmail(email, otp);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Still return success to not reveal email existence
            return res.status(200).json({
                message: 'If an account exists with this email, an OTP has been sent.',
            });
        }

        res.status(200).json({
            message: 'If an account exists with this email, an OTP has been sent.',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Find valid OTP
        const otpRecord = await OTP.findOne({
            email,
            otp,
            expiresAt: { $gt: new Date() }, // Not expired
            verified: false,
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark OTP as verified
        otpRecord.verified = true;
        await otpRecord.save();

        // Generate a temporary token for password reset (valid for 15 minutes)
        const resetToken = jwt.sign(
            { email, otpId: otpRecord._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({
            message: 'OTP verified successfully',
            resetToken,
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { resetToken, newPassword, confirmPassword } = req.body;

    try {
        if (!resetToken || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Verify reset token
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        } catch (tokenError) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        const { email, otpId } = decoded;

        // Verify OTP was used
        const otpRecord = await OTP.findOne({
            _id: otpId,
            email,
            verified: true,
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid reset token' });
        }

        // Find user and update password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        // Delete used OTP
        await OTP.deleteOne({ _id: otpId });

        res.status(200).json({
            message: 'Password reset successfully',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

// @desc    Upload profile picture
// @route   POST /api/auth/profile-picture
// @access  Private
const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { isCloudinaryConfigured } = require('../middleware/uploadMiddleware');
        let profilePictureUrl;

        if (isCloudinaryConfigured) {
            profilePictureUrl = req.file.path;
        } else {
            const b64 = req.file.buffer.toString('base64');
            profilePictureUrl = `data:${req.file.mimetype};base64,${b64}`;
        }

        user.profilePicture = profilePictureUrl;
        await user.save();

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
            message: 'Profile picture uploaded successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete profile picture
// @route   DELETE /api/auth/profile-picture
// @access  Private
const deleteProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.profilePicture = null;
        await user.save();

        res.json({
            _id: user._id,
            profilePicture: null,
            message: 'Profile picture deleted successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updatePassword,
    requestAccountDeletion,
    deleteAccount,
    uploadNICPhoto,
    deleteNICPhoto,
    uploadProfilePicture,
    deleteProfilePicture,
    forgotPassword,
    verifyOTP,
    resetPassword,
    getManagedUsers,
    updateProfile,
};
