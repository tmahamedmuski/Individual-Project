const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null // null if action doesn't belong to a specific user or is system-level
        },
        action: {
            type: String,
            required: true,
            enum: ['LOGIN', 'REGISTER', 'STATUS_CHANGE', 'ACCOUNT_DELETION', 'ADMIN_ACTION']
        },
        description: {
            type: String,
            required: true
        },
        metadata: {
            type: Object, // Flexible field for storing extra info like roles, old/new status, reasons
            default: {}
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
