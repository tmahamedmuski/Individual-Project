const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations, getUnreadCount, markAsRead } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, sendMessage);
router.get('/conversations/list', protect, getConversations);
router.get('/unread/count', protect, getUnreadCount);
router.put('/:userId/read', protect, markAsRead);
router.get('/:userId', protect, getMessages);

module.exports = router;
