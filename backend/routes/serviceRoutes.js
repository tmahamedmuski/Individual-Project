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
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createRequest);
router.route('/my').get(protect, getMyRequests);
router.route('/worker/my').get(protect, getWorkerJobs);
router.route('/workers').get(protect, getWorkers);
router.get('/available', protect, getAvailableRequests);
router.get('/:id', protect, getRequest);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
