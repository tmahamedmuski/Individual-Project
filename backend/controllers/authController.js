const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { fullName, email, password, role, phone, location, nic } = req.body;

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

    // Create user
    try {
        const user = await User.create({
            fullName,
            email,
            password,
            role: role || 'requester',
            phone,
            nic,
            location,
            skills: req.body.skills || [], // Add skills from request body
            accountStatus: 'pending', // Explicitly set status
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                phone: user.phone,
                nic: user.nic,
                location: user.location,
                // token: generateToken(user._id), // Do not login immediately
                message: 'Registration successful. Please wait for admin approval.',
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
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

            res.json({
                _id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
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

// @desc    Delete user account
// @route   DELETE /api/auth/delete
// @access  Private
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'Account deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    updatePassword,
    deleteAccount,
};
