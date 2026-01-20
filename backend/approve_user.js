const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const approveUser = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project_run');
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        const email = process.argv[2];

        if (!email) {
            console.log('Please provide an email address as an argument.');
            console.log('Usage: node approve_user.js <email>');
            process.exit(1);
        }

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found.');
            process.exit(1);
        }

        user.accountStatus = 'approved';
        user.isApproved = true; // Keep for backward compatibility if needed
        // user.role = 'admin'; // Optional: Uncomment to also promote to admin
        await user.save();

        console.log(`User ${user.fullName} (${user.email}) has been approved.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

approveUser();
