const Review = require('../models/Review');
const User = require('../models/User');
const ServiceRequest = require('../models/ServiceRequest');

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    const { revieweeId, serviceRequestId, rating, comment } = req.body;

    try {
        // Validate input
        if (!revieweeId || !serviceRequestId || !rating || !comment) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        // Only requester/worker involved in the job can review
        if (!['requester', 'worker'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Only requester or worker can submit reviews' });
        }

        // Check if service request exists
        const serviceRequest = await ServiceRequest.findById(serviceRequestId);
        if (!serviceRequest) {
            return res.status(404).json({ message: 'Service request not found' });
        }

        // Reviews allowed only when job is completed
        if (serviceRequest.status !== 'completed') {
            return res.status(400).json({ message: 'You can only review after the job is completed' });
        }

        // Must have an assigned worker to review
        if (!serviceRequest.worker) {
            return res.status(400).json({ message: 'Cannot review a request without an assigned worker' });
        }

        // Verify that the reviewer is part of the service request
        // Reviewer could be the requester or the worker
        const isRequester = serviceRequest.requester.toString() === req.user.id;
        const isWorker = serviceRequest.worker && serviceRequest.worker.toString() === req.user.id;

        if (!isRequester && !isWorker) {
            return res.status(401).json({ message: 'User not authorized to review this request' });
        }

        // Enforce "only review the other party"
        const expectedRevieweeId = isRequester
            ? serviceRequest.worker.toString()
            : serviceRequest.requester.toString();

        if (expectedRevieweeId !== revieweeId.toString()) {
            return res.status(400).json({ message: 'You can only review the other user in this completed job' });
        }

        // Check if review already exists
        const existingReview = await Review.findOne({
            reviewer: req.user.id,
            serviceRequest: serviceRequestId,
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this request' });
        }

        // Create review
        const review = await Review.create({
            reviewer: req.user.id,
            reviewee: revieweeId,
            serviceRequest: serviceRequestId,
            rating,
            comment,
            role: req.user.role,
        });

        // Update average rating for the reviewee (average = sum of all ratings ÷ count, e.g. 5/5 and 3/5 → 4/5)
        const reviewee = await User.findById(revieweeId);
        const currentTotal = (reviewee.averageRating || 0) * (reviewee.reviewCount || 0);
        const newCount = (reviewee.reviewCount || 0) + 1;
        const newAverage = (currentTotal + rating) / newCount;

        reviewee.averageRating = newAverage;
        reviewee.reviewCount = newCount;
        await reviewee.save();

        res.status(201).json(review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Incorrect' });
    }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'fullName role')
            .populate('serviceRequest', 'serviceType')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('reviewer', 'fullName role email')
            .populate('reviewee', 'fullName role email')
            .populate('serviceRequest', 'serviceType')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createReview,
    getUserReviews,
    getAllReviews,
};
