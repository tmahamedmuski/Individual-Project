const ServiceRequest = require('../models/ServiceRequest');
const User = require('../models/User');
const Bid = require('../models/Bid');
const { sendNewJobNotificationEmail, sendJobUpdatedNotificationEmail } = require('../utils/emailService');
const { sendNewJobSMS, sendJobUpdatedSMS } = require('../utils/smsService');

// @desc    Create new service request
// @route   POST /api/services
// @access  Private
const createRequest = async (req, res) => {
    const { serviceType, description, location, date, time, phoneNumber, budget, partsRequired } = req.body;

    if (!serviceType || !description || !location || !phoneNumber) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const now = new Date();
        const defaultDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const defaultTime = now.toTimeString().split(' ')[0]; // HH:MM:SS
        const requestDate = date || defaultDate;
        const requestTime = time || defaultTime;

        const request = await ServiceRequest.create({
            serviceType,
            description,
            location,
            date: requestDate,
            time: requestTime,
            phoneNumber,
            budget: budget != null && budget !== '' ? Number(budget) : undefined,
            partsRequired,
            requester: req.user.id,
        });

        // Find approved workers whose skills match this service type
        // Run this in background so it doesn't block the API response
        setTimeout(async () => {
            try {
                const workers = await User.find({ role: 'worker', accountStatus: 'approved' });
                
                const matchedWorkers = workers.filter(worker => {
                    const workerSkills = worker.skills || [];
                    if (workerSkills.length === 0) return false;
                    
                    const normalize = (str) => str.toLowerCase().trim();
                    const normalizedServiceType = normalize(serviceType);

                    return workerSkills.some(skill => {
                        const normalizedSkill = normalize(skill);
                        if (normalizedSkill === normalizedServiceType) return true;
                        if (normalizedSkill.startsWith('plumb') && normalizedServiceType.startsWith('plumb')) return true;
                        if (normalizedSkill.startsWith('electr') && normalizedServiceType.startsWith('electr')) return true;
                        if (normalizedSkill.startsWith('clean') && normalizedServiceType.startsWith('clean')) return true;
                        if (normalizedSkill.startsWith('carpent') && normalizedServiceType.startsWith('carpent')) return true;
                        if (normalizedSkill.startsWith('garden') && normalizedServiceType.startsWith('garden')) return true;
                        if (normalizedSkill.startsWith('paint') && normalizedServiceType.startsWith('paint')) return true;
                        return normalizedSkill.includes(normalizedServiceType) || normalizedServiceType.includes(normalizedSkill);
                    });
                });

                console.log(`[ServiceController] Found ${matchedWorkers.length} matching workers for job type: ${serviceType}`);
                
                for (const worker of matchedWorkers) {
                    sendNewJobNotificationEmail(worker.email, worker.fullName, request, worker.preferredLanguage || 'en').catch(err => {
                        console.error(`Failed to send job notification to ${worker.email}:`, err.message);
                    });
                    if (worker.phone) {
                        sendNewJobSMS(worker.phone, worker.fullName, request, worker.preferredLanguage || 'en').catch(err => {
                            console.error(`Failed to send job SMS notification to ${worker.phone}:`, err.message);
                        });
                    }
                }
            } catch (err) {
                console.error('[ServiceController] Error notifying matching workers:', err);
            }
        }, 0);

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
    const { lat, lng, maxDistance } = req.query;

    try {
        let workers;

        if (lat && lng) {
            // Use aggregation for geo-spatial search
            workers = await User.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [parseFloat(lng), parseFloat(lat)],
                        },
                        distanceField: 'distance',
                        maxDistance: maxDistance ? parseFloat(maxDistance) * 1000 : 50000, // default 50km if not specified
                        spherical: true,
                        query: { role: 'worker', accountStatus: 'approved' },
                    },
                },
                {
                    $project: {
                        password: 0,
                    },
                },
            ]);
        } else {
            // Fallback: Get all approved workers
            workers = await User.find({ role: 'worker', accountStatus: 'approved' }).select('-password');
        }

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

        // Notify workers of the update in the background
        setTimeout(async () => {
            try {
                // Determine who to notify:
                // 1. If the request has an assigned worker, notify that worker.
                // 2. Otherwise, notify all workers who have placed bids on this request.
                if (updatedRequest.worker) {
                    const assignedWorker = await User.findById(updatedRequest.worker);
                    if (assignedWorker) {
                        sendJobUpdatedNotificationEmail(
                            assignedWorker.email,
                            assignedWorker.fullName,
                            updatedRequest,
                            assignedWorker.preferredLanguage || 'en'
                        ).catch(err => console.error(`Failed to send update email to worker:`, err.message));

                        if (assignedWorker.phone) {
                            sendJobUpdatedSMS(
                                assignedWorker.phone,
                                assignedWorker.fullName,
                                updatedRequest,
                                assignedWorker.preferredLanguage || 'en'
                            ).catch(err => console.error(`Failed to send update SMS to worker:`, err.message));
                        }
                    }
                } else {
                    const bids = await Bid.find({ serviceRequest: updatedRequest._id }).populate('worker');
                    const notifiedWorkers = new Set();
                    for (const bid of bids) {
                        if (bid.worker && !notifiedWorkers.has(bid.worker._id.toString())) {
                            notifiedWorkers.add(bid.worker._id.toString());
                            sendJobUpdatedNotificationEmail(
                                bid.worker.email,
                                bid.worker.fullName,
                                updatedRequest,
                                bid.worker.preferredLanguage || 'en'
                            ).catch(err => console.error(`Failed to send update email to bidder:`, err.message));

                            if (bid.worker.phone) {
                                sendJobUpdatedSMS(
                                    bid.worker.phone,
                                    bid.worker.fullName,
                                    updatedRequest,
                                    bid.worker.preferredLanguage || 'en'
                                ).catch(err => console.error(`Failed to send update SMS to bidder:`, err.message));
                            }
                        }
                    }
                }
            } catch (notifyError) {
                console.error('Error sending updates notification:', notifyError);
            }
        }, 0);

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

// @desc    Get all requests across the platform
// @route   GET /api/services/broker/all-requests
// @access  Private (Broker)
const getBrokerAllRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({})
            .populate('requester', 'fullName email phone averageRating reviewCount')
            .populate('worker', 'fullName email phone rating')
            .sort({ createdAt: -1 });

        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get count of requester's active requests
// @route   GET /api/services/my/active-count
// @access  Private (Requester)
const getMyActiveRequestsCount = async (req, res) => {
    try {
        const count = await ServiceRequest.countDocuments({
            requester: req.user.id,
            status: { $in: ['pending', 'in_progress'] }
        });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get count of available jobs matching worker's skills
// @route   GET /api/services/worker/matched-count
// @access  Private (Worker)
const getWorkerMatchedJobsCount = async (req, res) => {
    try {
        const worker = await User.findById(req.user.id);
        if (!worker) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const workerSkills = worker.skills || [];
        
        const requests = await ServiceRequest.find({
            status: 'pending',
            requester: { $ne: req.user.id }
        });

        const matchedCount = requests.filter(job => {
            if (workerSkills.length === 0) return false;
            const normalize = (str) => str.toLowerCase().trim();
            const normalizedServiceType = normalize(job.serviceType);

            return workerSkills.some(skill => {
                const normalizedSkill = normalize(skill);
                if (normalizedSkill === normalizedServiceType) return true;
                if (normalizedSkill.startsWith('plumb') && normalizedServiceType.startsWith('plumb')) return true;
                if (normalizedSkill.startsWith('electr') && normalizedServiceType.startsWith('electr')) return true;
                if (normalizedSkill.startsWith('clean') && normalizedServiceType.startsWith('clean')) return true;
                if (normalizedSkill.startsWith('carpent') && normalizedServiceType.startsWith('carpent')) return true;
                if (normalizedSkill.startsWith('garden') && normalizedServiceType.startsWith('garden')) return true;
                if (normalizedSkill.startsWith('paint') && normalizedServiceType.startsWith('paint')) return true;
                return normalizedSkill.includes(normalizedServiceType) || normalizedServiceType.includes(normalizedSkill);
            });
        }).length;

        res.status(200).json({ count: matchedCount });
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
    deleteRequest,
    getWorkerJobs,
    getBrokerManagedJobs,
    getBrokerAllRequests,
    getMyActiveRequestsCount,
    getWorkerMatchedJobsCount,
};
