const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, content, serviceRequestId } = req.body;

    if (!receiverId || !content) {
        res.status(400);
        throw new Error('Please provide receiverId and content');
    }

    const message = await Message.create({
        sender: req.user.id,
        receiver: receiverId,
        content,
        serviceRequest: serviceRequestId || null,
    });

    const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'fullName avatar')
        .populate('receiver', 'fullName avatar');

    res.status(201).json(populatedMessage);
});

// @desc    Get messages with a specific user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const messages = await Message.find({
        $or: [
            { sender: req.user.id, receiver: userId },
            { sender: userId, receiver: req.user.id },
        ],
    })
        .populate('sender', 'fullName avatar')
        .populate('receiver', 'fullName avatar')
        .sort({ createdAt: 1 });

    res.status(200).json(messages);
});

// @desc    Get conversations (users interacted with)
// @route   GET /api/messages/conversations/list
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
    // Find all messages where current user is sender or receiver
    const messages = await Message.find({
        $or: [{ sender: req.user.id }, { receiver: req.user.id }],
    })
        .populate('sender', 'fullName avatar')
        .populate('receiver', 'fullName avatar')
        .sort({ createdAt: -1 });

    // Extract unique users
    const conversationMap = new Map();

    messages.forEach(msg => {
        if (!msg.sender || !msg.receiver) return;
        const otherUser = msg.sender._id.toString() === req.user.id
            ? msg.receiver
            : msg.sender;

        if (!otherUser || !otherUser._id) return;

        if (!conversationMap.has(otherUser._id.toString())) {
            conversationMap.set(otherUser._id.toString(), {
                user: {
                    _id: otherUser._id,
                    fullName: otherUser.fullName,
                    avatar: otherUser.avatar,
                },
                lastMessage: msg.content,
                timestamp: msg.createdAt,
                unreadCount: (msg.receiver._id.toString() === req.user.id && !msg.read) ? 1 : 0
            });
        } else {
            // Just update unread count if needed, we already have the latest message due to sort
            if (msg.receiver._id.toString() === req.user.id && !msg.read) {
                const conv = conversationMap.get(otherUser._id.toString());
                conv.unreadCount += 1;
            }
        }
    });

    const conversations = Array.from(conversationMap.values());

    res.status(200).json(conversations);
});

// @desc    Get unread messages count
// @route   GET /api/messages/unread/count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Message.countDocuments({
        receiver: req.user.id,
        read: false
    });
    res.status(200).json({ count });
});

// @desc    Mark messages from a user as read
// @route   PUT /api/messages/:userId/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    await Message.updateMany(
        { sender: userId, receiver: req.user.id, read: false },
        { read: true }
    );

    res.status(200).json({ success: true });
});

module.exports = {
    sendMessage,
    getMessages,
    getConversations,
    getUnreadCount,
    markAsRead
};
