const mongoose = require('mongoose');

const bidSchema = mongoose.Schema(
    {
        serviceRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ServiceRequest',
            required: true,
        },
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: [true, 'Please add a bid amount'],
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Bid', bidSchema);
