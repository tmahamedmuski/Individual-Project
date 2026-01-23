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
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/workers', protect, getWorkers);
router.get('/available', protect, getAvailableRequests);
router.get('/:id', protect, getRequest);
router.put('/:id', protect, updateRequest);
router.delete('/:id', protect, deleteRequest);

module.exports = router;
