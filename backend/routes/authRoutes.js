const express = require('express');
const router = express.Router();
const {
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
    getUserById,
    getAllUsersPublic,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');
const upload = uploadMiddleware;
const uploadRegistration = uploadMiddleware.uploadRegistration;

router.post('/register', uploadRegistration, registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/managed-users', protect, getManagedUsers);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/request-deletion', protect, requestAccountDeletion);
router.delete('/delete', protect, deleteAccount);
router.post('/nic-photo', protect, upload.single('nicPhoto'), uploadNICPhoto);
router.delete('/nic-photo', protect, deleteNICPhoto);
router.post('/profile-picture', protect, uploadMiddleware.uploadProfilePicture.single('profilePicture'), uploadProfilePicture);
router.delete('/profile-picture', protect, deleteProfilePicture);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.get('/user/:id', protect, getUserById);
router.get('/users', protect, getAllUsersPublic);

module.exports = router;
