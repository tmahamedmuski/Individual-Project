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
const sendOTPEmail = async (email, otp, language = 'en') => {
    console.log(`\n==================================================\n[OTP Notification] Generating OTP for ${email}: ${otp} (Language: ${language})\n==================================================\n`);
    try {
        const transporter = createTransporter();

        let subject, title, bodyText, expText, disclaimer;
        if (language === 'si') {
            subject = 'මුරපදය නැවත සැකසීමේ OTP කේතය';
            title = 'මුරපදය නැවත සැකසීමේ ඉල්ලීම';
            bodyText = 'ඔබ ඔබේ මුරපදය නැවත සැකසීමට ඉල්ලා ඇත. කරුණාකර පහත OTP කේතය භාවිතා කරන්න:';
            expText = 'මෙම OTP කේතය විනාඩි 10 කින් කල් ඉකුත් වේ.';
            disclaimer = 'ඔබ මෙය ඉල්ලා නොසිටියේ නම්, කරුණාකර මෙම විද්‍යුත් තැපෑල නොසලකා හරින්න.';
        } else if (language === 'ta') {
            subject = 'கடவுச்சொல் மீட்டமைப்பு OTP குறியீடு';
            title = 'கடவுச்சொல் மீட்டமைப்பு கோரிக்கை';
            bodyText = 'உங்கள் கடவுச்சொல்லை மீட்டமைக்க கோரியுள்ளீர்கள். பின்வரும் OTP குறியீட்டைப் பயன்படுத்தவும்:';
            expText = 'இந்த OTP குறியீடு 10 நிமிடங்களில் காலாவதியாகும்.';
            disclaimer = 'இதை நீங்கள் கோரவில்லை என்றால், இந்த மின்னஞ்சலைப் புறக்கணிக்கவும்.';
        } else {
            subject = 'Password Reset OTP';
            title = 'Password Reset Request';
            bodyText = 'You have requested to reset your password. Please use the following OTP code:';
            expText = 'This OTP will expire in 10 minutes.';
            disclaimer = "If you didn't request this, please ignore this email.";
        }

        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #333;">${title}</h2>
                    <p>${bodyText}</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 4px;">
                        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p>${expText}</p>
                    <p>${disclaimer}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message, please do not reply.</p>
                </div>
            `,
            text: `${title}\n\n${bodyText}\n\nOTP: ${otp}\n\n${expText}\n\n${disclaimer}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('OTP email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending OTP email:', error.message);
        throw error;
    }
};

// Send registration confirmation email
const sendRegistrationEmail = async (email, fullName, language = 'en') => {
    console.log(`\n==================================================\n[Email Notification] Registration email for ${fullName} (${email}) (Language: ${language})\n==================================================\n`);
    try {
        const transporter = createTransporter();

        let subject, title, bodyText, nextStepsTitle, step1, step2, step3, patienceText;
        if (language === 'si') {
            subject = 'ලියාපදිංචිය සාර්ථකයි - පරිපාලක අනුමැතිය ලැබෙන තෙක් රැඳී සිටින්න';
            title = 'Smart Service Platform වෙත සාදරයෙන් පිළිගනිමු!';
            bodyText = `හිතවත් ${fullName}, Smart Service Platform සමඟ ලියාපදිංචි වීම පිළිබඳව ස්තූතියි. ඔබගේ ලියාපදිංචිය සාර්ථකව ඉදිරිපත් කර ඇති අතර එය දැන් පරිපාලක අනුමැතිය ලැබෙන තෙක් පොරොත්තුවෙන් පවතී.`;
            nextStepsTitle = 'මීළඟ පියවර කුමක්ද?';
            step1 = 'අපගේ පරිපාලක කණ්ඩායම ඔබගේ ලියාපදිංචිය සමාලෝචනය කරනු ඇත.';
            step2 = 'ඔබගේ ගිණුම අනුමත හෝ ප්‍රතික්ෂේප කළ පසු ඔබට විද්‍යුත් තැපැල් දැනුම්දීමක් ලැබෙනු ඇත.';
            step3 = 'අනුමත වූ පසු, ඔබට ලොග් වී වේදිකාව භාවිතා කිරීම ආරම්භ කළ හැකිය.';
            patienceText = 'පරිපාලක අනුමැති ක්‍රියාවලිය සඳහා දක්වන ඉවසීම අගය කරමු.';
        } else if (language === 'ta') {
            subject = 'பதிவு வெற்றிகரமாக முடிந்தது - நிர்வாகி சரிபார்ப்பிற்காக காத்திருக்கிறது';
            title = 'ஸ்மார்ட் சேவை தளத்திற்கு உங்களை வரவேற்கிறோம்!';
            bodyText = `அன்பான ${fullName}, ஸ்மார்ட் சேவை தளத்தில் பதிவு செய்ததற்கு நன்றி. உங்கள் பதிவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டு, தற்போது நிர்வாகியின் சரிபார்ப்பிற்காக காத்திருக்கிறது.`;
            nextStepsTitle = 'அடுத்து என்ன நடக்கும்?';
            step1 = 'எங்கள் நிர்வாகக் குழு உங்கள் பதிவை பரிசீலிக்கும்.';
            step2 = 'உங்கள் கணக்கு அங்கீகரிக்கப்பட்டதும் அல்லது நிராகரிக்கப்பட்டதும் உங்களுக்கு மின்னஞ்சல் அறிவிப்பு வரும்.';
            step3 = 'அங்கீகரிக்கப்பட்டதும், நீங்கள் உள்நுழைந்து தளத்தைப் பயன்படுத்தத் தொடங்கலாம்.';
            patienceText = 'சரிபார்ப்பு காலத்தில் உங்களின் பொறுமைக்கு நன்றி தெரிவித்துக் கொள்கிறோம்.';
        } else {
            subject = 'Registration Successful - Awaiting Admin Verification';
            title = 'Welcome to Smart Service Platform!';
            bodyText = `Dear ${fullName}, Thank you for registering with Smart Service Platform. Your registration has been successfully submitted and is now awaiting admin verification.`;
            nextStepsTitle = 'What happens next?';
            step1 = 'Our admin team will review your registration';
            step2 = 'You will receive an email notification once your account is approved or rejected';
            step3 = 'Once approved, you can log in and start using the platform';
            patienceText = 'We appreciate your patience during the verification process.';
        }

        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #333;">${title}</h2>
                    <p>${bodyText}</p>
                    <div style="background-color: #f0f9ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 0; color: #0056b3;"><strong>${nextStepsTitle}</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>${step1}</li>
                            <li>${step2}</li>
                            <li>${step3}</li>
                        </ul>
                    </div>
                    <p>${patienceText}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message, please do not reply.</p>
                </div>
            `,
            text: `${title}\n\n${bodyText}\n\n${nextStepsTitle}\n- ${step1}\n- ${step2}\n- ${step3}\n\n${patienceText}`,
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
const sendStatusUpdateEmail = async (email, fullName, status, language = 'en') => {
    console.log(`\n==================================================\n[Email Notification] Status update email for ${fullName} (${email}) -> Status: ${status} (Language: ${language})\n==================================================\n`);
    try {
        const transporter = createTransporter();

        let subject, title, message, bgColor, borderColor, statusLabel, loginText;

        if (status === 'approved') {
            bgColor = '#f0fdf4';
            borderColor = '#22c55e';
            if (language === 'si') {
                subject = 'ගිණුම අනුමත කරන ලදී - Smart Service Platform වෙත සාදරයෙන් පිළිගනිමු!';
                title = '🎉 ඔබගේ ගිණුම අනුමත කර ඇත!';
                message = `සුභ පැතුම් ${fullName}! ඔබගේ ගිණුම අපගේ පරිපාලක කණ්ඩායම විසින් <strong>අනුමත</strong> කර ඇත. ඔබට දැන් ලොග් වී Smart Service Platform භාවිතා කිරීම ආරම්භ කළ හැක.`;
                statusLabel = 'ගිණුම් තත්ත්වය: අනුමතයි';
                loginText = 'ඔබේ ගිණුමට ලොග් වන්න';
            } else if (language === 'ta') {
                subject = 'கணக்கு அங்கீகரிக்கப்பட்டது - ஸ்மார்ட் சேவை தளத்திற்கு உங்களை வரவேற்கிறோம்!';
                title = '🎉 உங்கள் கணக்கு அங்கீகரிக்கப்பட்டுள்ளது!';
                message = `வாழ்த்துகள் ${fullName}! உங்கள் கணக்கு எங்கள் நிர்வாகக் குழுவால் <strong>அங்கீகரிக்கப்பட்டுள்ளது</strong>. நீங்கள் இப்போது உள்நுழைந்து ஸ்மார்ட் சேவை தளத்தைப் பயன்படுத்தத் தொடங்கலாம்.`;
                statusLabel = 'கணக்கு நிலை: அங்கீகரிக்கப்பட்டது';
                loginText = 'உங்கள் கணக்கில் உள்நுழைக';
            } else {
                subject = 'Account Approved - Welcome to Smart Service Platform!';
                title = '🎉 Your Account Has Been Approved!';
                message = `Congratulations ${fullName}! Your account has been <strong>approved</strong> by our admin team. You can now log in and start using the Smart Service Platform.`;
                statusLabel = 'Account Status: Approved';
                loginText = 'Login to Your Account';
            }
        } else if (status === 'rejected') {
            bgColor = '#fef2f2';
            borderColor = '#ef4444';
            if (language === 'si') {
                subject = 'ලියාපදිංචි තත්ත්වය යාවත්කාලීන කිරීම';
                title = 'ගිණුම් ලියාපදිංචිය පිළිබඳ යාවත්කාලීන කිරීම';
                message = `හිතවත් ${fullName}, ඔබගේ ගිණුම් ලියාපදිංචිය <strong>ප්‍රතික්ෂේප</strong> කර ඇති බව කණගාටුවෙන් දැනුම් දෙමු. මෙය වැරදීමකින් සිදු වූවක් යැයි ඔබ සිතන්නේ නම්, කරුණාකර අපගේ සහය කණ්ඩායම අමතන්න.`;
                statusLabel = 'ගිණුම් තත්ත්වය: ප්‍රතික්ෂේපිතයි';
            } else if (language === 'ta') {
                subject = 'கணக்கு பதிவு நிலை புதுப்பிப்பு';
                title = 'கணக்கு பதிவு புதுப்பிப்பு';
                message = `அன்பான ${fullName}, உங்கள் கணக்கு பதிவு <strong>நிராகரிக்கப்பட்டுள்ளது</strong> என்பதை வருத்தத்துடன் தெரிவித்துக் கொள்கிறோம். இது ஒரு பிழை என்று நீங்கள் கருதினால், உதவிக்கு எங்கள் ஆதரவுக் குழுவைத் தொடர்பு கொள்ளவும்.`;
                statusLabel = 'கணக்கு நிலை: நிராகரிக்கப்பட்டது';
            } else {
                subject = 'Account Registration Status Update';
                title = 'Account Registration Update';
                message = `Dear ${fullName}, We regret to inform you that your account registration has been <strong>rejected</strong>. If you believe this is an error, please contact our support team for assistance.`;
                statusLabel = 'Account Status: Rejected';
            }
        } else {
            bgColor = '#f3f4f6';
            borderColor = '#6b7280';
            if (language === 'si') {
                subject = 'ගිණුම් තත්ත්වය යාවත්කාලීන කිරීම';
                title = 'ගිණුම් තත්ත්වය යාවත්කාලීන කිරීම';
                message = `හිතවත් ${fullName}, ඔබගේ ගිණුම් තත්ත්වය <strong>${status}</strong> ලෙස යාවත්කාලීන කර ඇත.`;
                statusLabel = `ගිණුම් තත්ත්වය: ${status}`;
            } else if (language === 'ta') {
                subject = 'கணக்கு நிலை புதுப்பிப்பு';
                title = 'கணக்கு நிலை புதுப்பிப்பு';
                message = `அன்பான ${fullName}, உங்கள் கணக்கு நிலை <strong>${status}</strong> ஆக புதுப்பிக்கப்பட்டுள்ளது.`;
                statusLabel = `கணக்கு நிலை: ${status}`;
            } else {
                subject = 'Account Status Update';
                title = 'Account Status Update';
                message = `Dear ${fullName}, Your account status has been updated to <strong>${status}</strong>.`;
                statusLabel = `Account Status: ${status}`;
            }
        }

        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #333;">${title}</h2>
                    <p>${message}</p>
                    <div style="background-color: ${bgColor}; border-left: 4px solid ${borderColor}; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 0;"><strong>${statusLabel}</strong></p>
                    </div>
                    ${status === 'approved' ? `
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                ${loginText}
                            </a>
                        </div>
                    ` : ''}
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message, please do not reply.</p>
                </div>
            `,
            text: `${title}\n\n${message.replace(/<[^>]*>/g, '')}\n\n${statusLabel}`,
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
const sendNewJobNotificationEmail = async (email, fullName, serviceRequest, language = 'en') => {
    console.log(`\n==================================================\n[Email Notification] New matching job notification email for ${fullName} (${email}) -> Job: ${serviceRequest.serviceType} (Language: ${language})\n==================================================\n`);
    try {
        const transporter = createTransporter();

        let subject, title, bodyText, labelService, labelLoc, labelBudget, labelDesc, labelDateTime, btnText, footerText;
        if (language === 'si') {
            subject = 'ඔබගේ නිපුණතාවලට ගැලපෙන නව රැකියා අවස්ථාවක්!';
            title = '🛠️ නව රැකියා අවස්ථාවක්!';
            bodyText = `හිතවත් ${fullName}, ඔබගේ ලියාපදිංචි නිපුණතාවලට ගැලපෙන නව රැකියා ඉල්ලීමක් Smart Service Platform හි පළ කර ඇත:`;
            labelService = 'සේවා වර්ගය';
            labelLoc = 'ස්ථානය';
            labelBudget = 'අයවැය';
            labelDesc = 'විස්තරය';
            labelDateTime = 'දිනය/වේලාව';
            btnText = 'පවතින රැකියා බලා ලංසු තබන්න';
            footerText = 'මෙම රැකියාව සඳහා ලංසු තැබීමට සහ සේවාලාභියා සමඟ චැට් මගින් සාකච්ඡා කිරීමට පද්ධතියට ලොග් වන්න.';
        } else if (language === 'ta') {
            subject = 'உங்கள் திறமைக்கேற்ற புதிய வேலை வாய்ப்பு!';
            title = '🛠️ புதிய வேலை வாய்ப்பு!';
            bodyText = `அன்பான ${fullName}, உங்களின் பதிவுசெய்யப்பட்ட திறன்களுக்குப் பொருந்தக்கூடிய புதிய வேலைக் கோரிக்கை ஸ்மார்ட் சேவை தளத்தில் வெளியிடப்பட்டுள்ளது:`;
            labelService = 'சேவை வகை';
            labelLoc = 'இருப்பிடம்';
            labelBudget = 'வரவுசெலவுத் திட்டம்';
            labelDesc = 'விளக்கம்';
            labelDateTime = 'தேதி/நேரம்';
            btnText = 'வேலைகளைப் பார்த்து ஏலம் கேட்கவும்';
            footerText = 'இந்த வேலைக்கு ஏலம் கேட்கவும், வாடிக்கையாளருடன் அரட்டை (chat) மூலம் விவாதிக்கவும் உள்நுழையவும்.';
        } else {
            subject = 'New Job Opportunity Matching Your Skills!';
            title = '🛠️ New Job Opportunity!';
            bodyText = `Dear ${fullName},\n\nA new job request has been posted on the Smart Service Platform that matches your registered skills:`;
            labelService = 'Service Type';
            labelLoc = 'Location';
            labelBudget = 'Budget';
            labelDesc = 'Description';
            labelDateTime = 'Date/Time';
            btnText = 'View Available Jobs & Bid';
            footerText = 'Log in to bid on this job and discuss details with the client via our chat feature.';
        }

        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #007bff; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 0;">${title}</h2>
                    <p>Dear ${fullName},</p>
                    <p>${bodyText}</p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 5px 0;"><strong>${labelService}:</strong> ${serviceRequest.serviceType}</p>
                        <p style="margin: 5px 0;"><strong>${labelLoc}:</strong> ${serviceRequest.location}</p>
                        ${serviceRequest.budget ? `<p style="margin: 5px 0;"><strong>${labelBudget}:</strong> LKR ${serviceRequest.budget}</p>` : ''}
                        <p style="margin: 5px 0;"><strong>${labelDesc}:</strong> ${serviceRequest.description}</p>
                        <p style="margin: 5px 0;"><strong>${labelDateTime}:</strong> ${serviceRequest.date} at ${serviceRequest.time}</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                           style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            ${btnText}
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">${footerText}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message from Smart Service Platform, please do not reply.</p>
                </div>
            `,
            text: `${title}\n\nDear ${fullName},\n\n${bodyText}\n- ${labelService}: ${serviceRequest.serviceType}\n- ${labelLoc}: ${serviceRequest.location}\n- ${labelBudget}: ${serviceRequest.budget ? 'LKR ' + serviceRequest.budget : 'N/A'}\n- ${labelDesc}: ${serviceRequest.description}\n\nLog in: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
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
const sendBidRejectedNotificationEmail = async (email, fullName, serviceRequest, language = 'en') => {
    console.log(`\n==================================================\n[Email Notification] Bid rejection notification email for ${fullName} (${email}) -> Job: ${serviceRequest.serviceType} (Language: ${language})\n==================================================\n`);
    try {
        const transporter = createTransporter();

        let subject, title, bodyTextIntro, mainMessage, nextStepsText, btnText;
        if (language === 'si') {
            subject = 'රැකියා ඉල්ලීම යාවත්කාලීන කිරීම - තනතුර පුරවා ඇත';
            title = 'රැකියා ඉල්ලීම පිළිබඳ යාවත්කාලීන කිරීම';
            bodyTextIntro = 'පහත සඳහන් රැකියා ඉල්ලීම සඳහා ලංසුවක් ඉදිරිපත් කිරීම පිළිබඳව ඔබට ස්තූතියි:';
            mainMessage = 'සේවාදායකයා මෙම කාර්යය සඳහා වෙනත් සේවකයෙකු තෝරාගෙන ඇති බැවින් එම තනතුර දැන් පිරවී ඇති බව කණගාටුවෙන් දැනුම් දෙමු.';
            nextStepsText = 'අප කෙරෙහි දැක්වූ උනන්දුව අගය කරන අතර පද්ධතියේ ඇති වෙනත් රැකියා අවස්ථා සඳහා ලංසු ඉදිරිපත් කිරීමට ඔබට ආරාධනා කරමු.';
            btnText = 'වෙනත් පවතින රැකියා බලන්න';
        } else if (language === 'ta') {
            subject = 'வேலைக் கோரிக்கை புதுப்பிப்பு - இடம் நிரப்பப்பட்டது';
            title = 'வேலைக் கோரிக்கை புதுப்பிப்பு';
            bodyTextIntro = 'பின்வரும் வேலைக் கோரிக்கைக்கு ஏலத்தை சமர்ப்பித்ததற்கு நன்றி:';
            mainMessage = 'இந்த பணிக்கு வாடிக்கையாளர் வேறொரு பணியாளரைத் தேர்ந்தெடுத்துள்ளார் என்றும், அந்த இடம் தற்போது நிரப்பப்பட்டுவிட்டது என்றும் உங்களுக்குத் தெரிவித்துக் கொள்கிறோம்.';
            nextStepsText = 'உங்களின் ஆர்வத்திற்கு நன்றி. தட்டச்சுப்பலகையில் கிடைக்கும் பிற வேலைகளுக்கு தொடர்ந்து விண்ணப்பிக்குமாறு கேட்டுக்கொள்கிறோம்.';
            btnText = 'கிடைக்கக்கூடிய பிற வேலைகளைப் பார்க்கவும்';
        } else {
            subject = 'Job Request Update - Position Filled';
            title = 'Job Request Update';
            bodyTextIntro = 'Thank you for submitting a bid for the following job request:';
            mainMessage = 'We wanted to let you know that the client has selected another worker for this task, and the position has now been filled.';
            nextStepsText = 'We appreciate your interest and encourage you to continue applying for other available opportunities on the platform that match your skills.';
            btnText = 'View Other Available Jobs';
        }

        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #6c757d; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 0;">${title}</h2>
                    <p>Dear ${fullName},</p>
                    <p>${bodyTextIntro}</p>
                    
                    <div style="background-color: #f8f9fa; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 5px 0;"><strong>Service Type:</strong> ${serviceRequest.serviceType}</p>
                        <p style="margin: 5px 0;"><strong>Description:</strong> ${serviceRequest.description}</p>
                    </div>

                    <p>${mainMessage}</p>
                    <p>${nextStepsText}</p>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                           style="background-color: #6c757d; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            ${btnText}
                        </a>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message from Smart Service Platform, please do not reply.</p>
                </div>
            `,
            text: `${title}\n\nDear ${fullName},\n\n${bodyTextIntro}\n- Job: ${serviceRequest.serviceType}\n\n${mainMessage}\n\n${nextStepsText}`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Bid rejection email sent to:', email, info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending bid rejection email:', error.message);
        return { success: false, error: error.message };
    }
};

// Send notification to worker that a job request was updated
const sendJobUpdatedNotificationEmail = async (email, fullName, serviceRequest, language = 'en') => {
    console.log(`\n==================================================\n[Email Notification] Job update notification email for ${fullName} (${email}) -> Job: ${serviceRequest.serviceType} (Language: ${language})\n==================================================\n`);
    try {
        const transporter = createTransporter();

        let subject, title, bodyText, labelService, labelLoc, labelBudget, labelDesc, labelDateTime, btnText, footerText;
        if (language === 'si') {
            subject = 'යාවත්කාලීන කරන ලද රැකියා ඉල්ලීමක්!';
            title = '🔄 රැකියා ඉල්ලීම යාවත්කාලීන කර ඇත!';
            bodyText = `හිතවත් ${fullName}, ඔබ සම්බන්ධ වූ/ලංසු තැබූ පහත සඳහන් රැකියා ඉල්ලීම සේවාලාභියා විසින් යාවත්කාලීන කර ඇත:`;
            labelService = 'සේවා වර්ගය';
            labelLoc = 'ස්ථානය';
            labelBudget = 'අයවැය';
            labelDesc = 'විස්තරය';
            labelDateTime = 'දිනය/වේලාව';
            btnText = 'යාවත්කාලීන විස්තර බලන්න';
            footerText = 'නව විස්තර පරීක්ෂා කිරීමට සහ සේවාලාභියා සමඟ චැට් මගින් සාකච්ඡා කිරීමට පද්ධතියට ලොග් වන්න.';
        } else if (language === 'ta') {
            subject = 'வேலைக் கோரிக்கை புதுப்பிக்கப்பட்டுள்ளது!';
            title = '🔄 வேலைக் கோரிக்கை புதுப்பிக்கப்பட்டது!';
            bodyText = `அன்பான ${fullName}, நீங்கள் ஏலம் கேட்ட/நியமிக்கப்பட்ட பின்வரும் வேலைக் கோரிக்கை வாடிக்கையாளரால் புதுப்பிக்கப்பட்டுள்ளது:`;
            labelService = 'சேவை வகை';
            labelLoc = 'இருப்பிடம்';
            labelBudget = 'வரவுசெலவுத் திட்டம்';
            labelDesc = 'விளக்கம்';
            labelDateTime = 'தேதி/நேரம்';
            btnText = 'புதுப்பிக்கப்பட்ட விவரங்களைப் பார்க்கவும்';
            footerText = 'புதிய விவரங்களைச் சரிபார்க்கவும், வாடிக்கையாளருடன் அரட்டை அடிக்கவும் உள்நுழையவும்.';
        } else {
            subject = 'Job Request Updated!';
            title = '🔄 Job Request Updated!';
            bodyText = `Dear ${fullName},\n\nA job request you bidded on or are assigned to has been updated by the client:`;
            labelService = 'Service Type';
            labelLoc = 'Location';
            labelBudget = 'Budget';
            labelDesc = 'Description';
            labelDateTime = 'Date/Time';
            btnText = 'View Updated Details';
            footerText = 'Log in to view the new details and communicate with the client via our chat feature.';
        }

        const mailOptions = {
            from: `"Smart Service Platform" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
                    <h2 style="color: #28a745; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 0;">${title}</h2>
                    <p>Dear ${fullName},</p>
                    <p>${bodyText}</p>
                    
                    <div style="background-color: #f4fdf6; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <p style="margin: 5px 0;"><strong>${labelService}:</strong> ${serviceRequest.serviceType}</p>
                        <p style="margin: 5px 0;"><strong>${labelLoc}:</strong> ${serviceRequest.location}</p>
                        ${serviceRequest.budget ? `<p style="margin: 5px 0;"><strong>${labelBudget}:</strong> LKR ${serviceRequest.budget}</p>` : ''}
                        <p style="margin: 5px 0;"><strong>${labelDesc}:</strong> ${serviceRequest.description}</p>
                        <p style="margin: 5px 0;"><strong>${labelDateTime}:</strong> ${serviceRequest.date} at ${serviceRequest.time}</p>
                    </div>

                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" 
                           style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                            ${btnText}
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">${footerText}</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #999; font-size: 12px; text-align: center;">This is an automated message from Smart Service Platform, please do not reply.</p>
                </div>
            `,
            text: `${title}\n\nDear ${fullName},\n\n${bodyText}\n- ${labelService}: ${serviceRequest.serviceType}\n- ${labelLoc}: ${serviceRequest.location}\n- ${labelBudget}: ${serviceRequest.budget ? 'LKR ' + serviceRequest.budget : 'N/A'}\n- ${labelDesc}: ${serviceRequest.description}\n\nLog in: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Job update notification email sent to:', email, info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending job update notification email:', error.message);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOTPEmail,
    sendRegistrationEmail,
    sendStatusUpdateEmail,
    sendNewJobNotificationEmail,
    sendBidRejectedNotificationEmail,
    sendJobUpdatedNotificationEmail,
};
