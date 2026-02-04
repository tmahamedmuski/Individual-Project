const express = require('express');
const router = express.Router();
const { placeBid, getBidsForRequest, acceptBid } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, placeBid);
router.get('/:requestId', protect, getBidsForRequest);
router.put('/:bidId/accept', protect, acceptBid);

module.exports = router;
