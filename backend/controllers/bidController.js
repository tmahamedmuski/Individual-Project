const asyncHandler = require('express-async-handler');
const Bid = require('../models/Bid');
const ServiceRequest = require('../models/ServiceRequest');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private (Worker)
const placeBid = asyncHandler(async (req, res) => {
    const { serviceRequestId, amount } = req.body;

    if (!serviceRequestId || !amount) {
        res.status(400);
        throw new Error('Please provide serviceRequestId and amount');
    }

    const serviceRequest = await ServiceRequest.findById(serviceRequestId);

    if (!serviceRequest) {
        res.status(404);
        throw new Error('Service Request not found');
    }

    // Check if worker has already bid
    const existingBid = await Bid.findOne({
        serviceRequest: serviceRequestId,
        worker: req.user.id,
    });

    if (existingBid) {
        res.status(400);
        throw new Error('You have already placed a bid for this request');
    }

    const bid = await Bid.create({
        serviceRequest: serviceRequestId,
        worker: req.user.id,
        amount,
    });

    res.status(201).json(bid);
});

// @desc    Get bids for a service request
// @route   GET /api/bids/:requestId
// @access  Private (Requester/Worker) - Ideally Requester or the specific Worker (for their own bid)
const getBidsForRequest = asyncHandler(async (req, res) => {
    const bids = await Bid.find({ serviceRequest: req.params.requestId })
        .populate('worker', 'fullName email phone rating')
        .sort('-createdAt');

    res.status(200).json(bids);
});

const acceptBid = asyncHandler(async (req, res) => {
    const { bidId } = req.params;

    // Find the bid
    const bid = await Bid.findById(bidId).populate('serviceRequest');

    if (!bid) {
        res.status(404);
        throw new Error('Bid not found');
    }

    const serviceRequest = await ServiceRequest.findById(bid.serviceRequest._id);

    // Check if user is the owner of the service request
    if (serviceRequest.requester.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to accept bids for this request');
    }

    // Update Bid status
    bid.status = 'accepted';
    await bid.save();

    // Update Service Request
    serviceRequest.worker = bid.worker;
    serviceRequest.status = 'in_progress';
    serviceRequest.budget = bid.amount; // Update budget to agreed amount
    await serviceRequest.save();

    // Reject other bids for this request (Optional)
    // await Bid.updateMany(
    //     { serviceRequest: serviceRequest._id, _id: { $ne: bidId } },
    //     { status: 'rejected' }
    // );

    res.status(200).json({
        message: 'Bid accepted successfully',
        bid,
        serviceRequest
    });
});

module.exports = {
    placeBid,
    getBidsForRequest,
    acceptBid,
};
