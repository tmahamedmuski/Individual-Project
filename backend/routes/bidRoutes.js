const express = require('express');
const router = express.Router();
const { placeBid, getBidsForRequest } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, placeBid);
router.get('/:requestId', protect, getBidsForRequest);

module.exports = router;
