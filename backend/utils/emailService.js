const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
    // For development, you can use Gmail or other SMTP services
    // Update these in your .env file
    const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '';
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // Your email
            pass: pass, // Your email password or app password (stripped of spaces)
        },
    });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    console.log(`\n==================================================\n[OTP Notification] Generating OTP for ${email}: ${otp}\n==================================================\n`);
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
    console.log(`\n==================================================\n[Email Notification] Registration email for ${fullName} (${email})\n==================================================\n`);
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
    console.log(`\n==================================================\n[Email Notification] Status update email for ${fullName} (${email}) -> Status: ${status}\n==================================================\n`);
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
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
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

// Send notification to worker about a new job matching their skills
const sendNewJobNotificationEmail = async (email, fullName, serviceRequest) => {
    console.log(`\n==================================================\n[Email Notification] New matching job notification email for ${fullName} (${email}) -> Job: ${serviceRequest.serviceType}\n==================================================\n`);
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'New Job Opportunity Matching Your Skills!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #007bff; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 0;">🛠️ New Job Opportunity!</h2>
                    <p>Dear ${fullName},</p>
                    <p>A new job request has been posted on the Smart Service Platform that matches your registered skills:</p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 5px 0;"><strong>Service Type:</strong> ${serviceRequest.serviceType}</p>
                        <p style="margin: 5px 0;"><strong>Location:</strong> ${serviceRequest.location}</p>
                        ${serviceRequest.budget ? `<p style="margin: 5px 0;"><strong>Budget:</strong> LKR ${serviceRequest.budget}</p>` : ''}
                        <p style="margin: 5px 0;"><strong>Description:</strong> ${serviceRequest.description}</p>
                        <p style="margin: 5px 0;"><strong>Date/Time:</strong> ${serviceRequest.date} at ${serviceRequest.time}</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                           style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            View Available Jobs & Bid
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">Log in to bid on this job and discuss details with the client via our chat feature.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message from Smart Service Platform, please do not reply.</p>
                </div>
            `,
            text: `🛠️ New Job Opportunity!\n\nDear ${fullName},\n\nA new job matching your skills has been posted:\n- Service Type: ${serviceRequest.serviceType}\n- Location: ${serviceRequest.location}\n- Budget: ${serviceRequest.budget ? 'LKR ' + serviceRequest.budget : 'Not Specified'}\n- Description: ${serviceRequest.description}\n\nLog in to bid: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('New job notification email sent to:', email, info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending new job notification email:', error.message);
        return { success: false, error: error.message };
    }
};

// Send notification to worker that their bid was rejected / job was filled
const sendBidRejectedNotificationEmail = async (email, fullName, serviceRequest) => {
    console.log(`\n==================================================\n[Email Notification] Bid rejection notification email for ${fullName} (${email}) -> Job: ${serviceRequest.serviceType}\n==================================================\n`);
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Job Request Update - Position Filled',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #6c757d; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 0;">Job Request Update</h2>
                    <p>Dear ${fullName},</p>
                    <p>Thank you for submitting a bid for the following job request:</p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 5px 0;"><strong>Service Type:</strong> ${serviceRequest.serviceType}</p>
                        <p style="margin: 5px 0;"><strong>Description:</strong> ${serviceRequest.description}</p>
                    </div>

                    <p>We wanted to let you know that the client has selected another worker for this task, and the position has now been filled.</p>
                    <p>We appreciate your interest and encourage you to continue applying for other available opportunities on the platform that match your skills.</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                           style="background-color: #6c757d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            View Other Available Jobs
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message from Smart Service Platform, please do not reply.</p>
                </div>
            `,
            text: `Job Request Update\n\nDear ${fullName},\n\nThank you for bidding on the job request for "${serviceRequest.serviceType}". The client has selected another worker for this task, and the position has been filled.\n\nKeep looking for other jobs: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Bid rejection email sent to:', email, info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending bid rejection email:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOTPEmail,
    sendRegistrationEmail,
    sendStatusUpdateEmail,
    sendNewJobNotificationEmail,
    sendBidRejectedNotificationEmail,
};
