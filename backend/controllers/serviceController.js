const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

// @desc    Create new service request
// @route   POST /api/services
// @access  Private
const createRequest = async (req, res) => {
    const { serviceType, description, location, date, time } = req.body;

    if (!serviceType || !description || !location || !date || !time) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const request = await ServiceRequest.create({
            serviceType,
            description,
            location,
            date,
            time,
            requester: req.user.id,
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user requests
// @route   GET /api/services/my
// @access  Private
const getMyRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ requester: req.user.id })
            .populate('worker', 'fullName email phone rating') // Populate worker details if assigned
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all workers
// @route   GET /api/services/workers
// @access  Private
const getWorkers = async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' }).select('-password');
        res.status(200).json(workers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRequest,
    getMyRequests,
    getWorkers,
};
