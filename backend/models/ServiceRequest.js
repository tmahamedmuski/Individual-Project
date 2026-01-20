const mongoose = require('mongoose');

const serviceRequestSchema = mongoose.Schema(
    {
        serviceType: {
            type: String,
            required: [true, 'Please select a service type'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        location: {
            type: String,
            required: [true, 'Please add a location'],
        },
        date: {
            type: String,
            required: [true, 'Please add a date'],
        },
        time: {
            type: String,
            required: [true, 'Please add a time'],
        },
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'completed'],
            default: 'pending',
        },
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
