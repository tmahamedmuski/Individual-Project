const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');

// @desc    Create new service request
// @route   POST /api/services
// @access  Private
const createRequest = async (req, res) => {
    const { serviceType, description, location, date, time, phoneNumber, budget } = req.body;

    if (!serviceType || !description || !location || !date || !time || !phoneNumber) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const request = await ServiceRequest.create({
            serviceType,
            description,
            location,
            date,
            time,
            phoneNumber,
            budget: budget != null && budget !== '' ? Number(budget) : undefined,
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

// @desc    Get all available (pending) requests - used by workers and brokers to view open jobs from other requesters (excludes own requests)
// @route   GET /api/services/available
// @access  Private (worker, broker, or requester)
const getAvailableRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({
            status: 'pending',
            requester: { $ne: req.user.id },
        })
            .populate('requester', 'fullName email phone')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single service request
// @route   GET /api/services/:id
// @access  Private
const getRequest = async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update service request
// @route   PUT /api/services/:id
// @access  Private
const updateRequest = async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Check user
        if (request.requester.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedRequest = await ServiceRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete service request
// @route   DELETE /api/services/:id
// @access  Private
const deleteRequest = async (req, res) => {
    try {
        const request = await ServiceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Check user
        if (request.requester.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await request.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get requests assigned to worker
// @route   GET /api/services/worker/my
// @access  Private
const getWorkerJobs = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ worker: req.user.id })
            .populate('requester', 'fullName email phone averageRating reviewCount')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get jobs assigned to broker's managed workers (Broker view of "work")
// @route   GET /api/services/broker/managed-jobs
// @access  Private (Broker)
const getBrokerManagedJobs = async (req, res) => {
    try {
        const managedUserIds = await User.find({ addedBy: req.user.id }).distinct('_id');
        const requests = await ServiceRequest.find({ worker: { $in: managedUserIds } })
            .populate('requester', 'fullName email phone averageRating reviewCount')
            .populate('worker', 'fullName email phone rating')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createRequest,
    getMyRequests,
    getWorkers,
    getAvailableRequests,
    getRequest,
    updateRequest,
    updateRequest,
    deleteRequest,
    getWorkerJobs,
    getBrokerManagedJobs,
};
