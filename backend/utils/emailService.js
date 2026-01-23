const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
    // For development, you can use Gmail or other SMTP services
    // Update these in your .env file
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // Your email
            pass: process.env.SMTP_PASS, // Your email password or app password
        },
    });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Password Reset OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>You have requested to reset your password. Please use the following OTP code:</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
                </div>
            `,
            text: `Your password reset OTP is: ${otp}. This OTP will expire in 10 minutes.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

// Send registration confirmation email
const sendRegistrationEmail = async (email, fullName) => {
    try {
        const transporter = createTransporter();
        
        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Registration Successful - Awaiting Admin Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to Smart Service Platform!</h2>
                    <p>Dear ${fullName},</p>
                    <p>Thank you for registering with Smart Service Platform. Your registration has been <strong>successfully submitted</strong> and is now <strong>waiting for admin verification</strong>.</p>
                    <div style="background-color: #f0f9ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0; color: #0056b3;"><strong>What happens next?</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Our admin team will review your registration</li>
                            <li>You will receive an email notification once your account is approved or rejected</li>
                            <li>Once approved, you can log in and start using the platform</li>
                        </ul>
                    </div>
                    <p>We appreciate your patience during the verification process.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
                </div>
            `,
            text: `Welcome to Smart Service Platform! Dear ${fullName}, Thank you for registering. Your registration has been successfully submitted and is now waiting for admin verification. You will receive an email notification once your account is approved or rejected.`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Registration email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending registration email:', error);
        throw error;
    }
};

// Send account status update email
const sendStatusUpdateEmail = async (email, fullName, status) => {
    try {
        const transporter = createTransporter();
        
        let subject, title, message, bgColor, borderColor;
        
        switch (status) {
            case 'approved':
                subject = 'Account Approved - Welcome to Smart Service Platform!';
                title = '🎉 Your Account Has Been Approved!';
                message = `Congratulations ${fullName}! Your account has been <strong>approved</strong> by our admin team. You can now log in and start using the Smart Service Platform.`;
                bgColor = '#f0fdf4';
                borderColor = '#22c55e';
                break;
            case 'rejected':
                subject = 'Account Registration Status Update';
                title = 'Account Registration Update';
                message = `Dear ${fullName}, We regret to inform you that your account registration has been <strong>rejected</strong>. If you believe this is an error, please contact our support team for assistance.`;
                bgColor = '#fef2f2';
                borderColor = '#ef4444';
                break;
            case 'pending':
                subject = 'Account Status - Pending Verification';
                title = 'Account Verification Pending';
                message = `Dear ${fullName}, Your account is currently <strong>pending</strong> verification. Our admin team is reviewing your registration and you will be notified once a decision is made.`;
                bgColor = '#fef3c7';
                borderColor = '#f59e0b';
                break;
            default:
                subject = 'Account Status Update';
                title = 'Account Status Update';
                message = `Dear ${fullName}, Your account status has been updated to <strong>${status}</strong>.`;
                bgColor = '#f3f4f6';
                borderColor = '#6b7280';
        }
        
        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">${title}</h2>
                    <p>${message}</p>
                    <div style="background-color: ${bgColor}; border-left: 4px solid ${borderColor}; padding: 15px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Account Status:</strong> <span style="text-transform: capitalize;">${status}</span></p>
                    </div>
                    ${status === 'approved' ? `
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/login" 
                               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                                Login to Your Account
                            </a>
                        </div>
                    ` : ''}
                    ${status === 'rejected' ? `
                        <p>If you have any questions or concerns, please don't hesitate to contact our support team.</p>
                    ` : ''}
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
                </div>
            `,
            text: `${title}\n\n${message.replace(/<[^>]*>/g, '')}\n\nAccount Status: ${status}${status === 'approved' ? '\n\nYou can now log in to your account.' : ''}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Status update email sent (${status}):`, info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending status update email:', error);
        throw error;
    }
};

module.exports = {
    sendOTPEmail,
    sendRegistrationEmail,
    sendStatusUpdateEmail,
};
