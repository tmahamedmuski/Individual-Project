const express = require('express');
const router = express.Router();
const {
    createReview,
    getUserReviews,
    getAllReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

router.post('/', protect, createReview);
// Public: anyone can view a user's ratings/reviews
router.get('/user/:userId', getUserReviews);
router.get('/', protect, adminOnly, getAllReviews);

module.exports = router;
