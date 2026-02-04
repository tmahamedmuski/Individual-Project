const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reviewee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        serviceRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ServiceRequest',
            required: true,
        },
        rating: {
            type: Number,
            required: [true, 'Please add a rating between 1 and 5'],
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: [true, 'Please add a comment'],
        },
        role: {
            type: String,
            enum: ['requester', 'worker', 'broker', 'admin'],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent user from submitting more than one review per service request
reviewSchema.index({ serviceRequest: 1, reviewer: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
