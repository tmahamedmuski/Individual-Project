const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createRequest);
router.route('/my').get(protect, getMyRequests);
router.route('/my/active-count').get(protect, getMyActiveRequestsCount);
router.route('/worker/my').get(protect, getWorkerJobs);
router.route('/worker/matched-count').get(protect, getWorkerMatchedJobsCount);
router.get('/broker/managed-jobs', protect, getBrokerManagedJobs);
router.get('/broker/all-requests', protect, getBrokerAllRequests);
router.route('/workers').get(protect, getWorkers);
router.get('/available', protect, getAvailableRequests);
router.get('/:id', protect, getRequest);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
