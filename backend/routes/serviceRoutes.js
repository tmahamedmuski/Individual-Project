const express = require('express');
const router = express.Router();
const {
    createRequest,
    getMyRequests,
    getWorkers,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createRequest);
router.get('/my', protect, getMyRequests);
router.get('/workers', protect, getWorkers);

module.exports = router;
