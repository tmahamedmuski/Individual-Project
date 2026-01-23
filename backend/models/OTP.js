const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            index: true,
        },
        otp: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
            index: { expireAfterSeconds: 0 }, // Auto-delete expired documents
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Create index for automatic cleanup
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', otpSchema);
