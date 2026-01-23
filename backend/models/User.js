const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
        },
        nic: {
            type: String,
            required: [true, 'Please add a NIC number'],
            unique: true,
        },
        nicPhoto: {
            type: String,
            default: null,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                index: '2dsphere',
            },
            address: {
                type: String,
            },
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        role: {
            type: String,
            enum: ['requester', 'worker', 'broker', 'admin'],
            default: 'requester',
        },
        // isApproved: { type: Boolean, default: false }, // Deprecated
        accountStatus: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        rejectionTimestamp: {
            type: Date,
            default: null,
        },
        workingPhotos: {
            type: [String],
            default: [],
        },
        gpLetters: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
