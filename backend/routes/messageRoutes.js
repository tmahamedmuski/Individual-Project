const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/conversations/list', protect, getConversations); // Put specific routes before parameter routes
router.get('/:userId', protect, getMessages);

module.exports = router;
