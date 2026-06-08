const sendSMS = async (to, body) => {
    console.log(`\n==================================================\n[SMS Notification] To: ${to}\nMessage: ${body}\n==================================================\n`);
    
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        try {
            const twilio = require('twilio');
            const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
            const message = await client.messages.create({
                body: body,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: to
            });
            console.log(`[SMS Notification] Sent via Twilio. SID: ${message.sid}`);
            return { success: true, sid: message.sid };
        } catch (error) {
            console.error('[SMS Notification] Twilio error:', error.message);
            return { success: false, error: error.message };
        }
    }
    return { success: true, mock: true };
};

// Send notification to worker about a new job matching their skills
const sendNewJobSMS = async (phone, fullName, serviceRequest, language = 'en') => {
    console.log(`[SMS Log] Preparing new job SMS for ${fullName} (${phone})`);
    let body;
    if (language === 'si') {
        body = `හිතවත් ${fullName}, ඔබගේ නිපුණතාවලට ගැලපෙන නව රැකියාවක් පවතී: ${serviceRequest.location} හි ${serviceRequest.serviceType}. අයවැය: LKR ${serviceRequest.budget || 'N/A'}. විස්තර බලා ලංසු තබන්න!`;
    } else if (language === 'ta') {
        body = `அன்பான ${fullName}, உங்களது திறமைக்கேற்ற புதிய வேலை உள்ளது: ${serviceRequest.location}-இல் ${serviceRequest.serviceType}. வரவுசெலவு: LKR ${serviceRequest.budget || 'N/A'}. விவரங்களைப் பார்த்து ஏலம் கேட்கவும்!`;
    } else {
        body = `Hi ${fullName}, a new job matching your skills is available: ${serviceRequest.serviceType} at ${serviceRequest.location}. Budget: LKR ${serviceRequest.budget || 'N/A'}. View details and bid on the Smart Service Platform!`;
    }
    return sendSMS(phone, body);
};

// Send notification to worker that their bid was rejected / job was filled
const sendBidRejectedSMS = async (phone, fullName, serviceRequest, language = 'en') => {
    console.log(`[SMS Log] Preparing bid rejection SMS for ${fullName} (${phone})`);
    let body;
    if (language === 'si') {
        body = `හිතවත් ${fullName}, ඔබ ලංසු තැබූ "${serviceRequest.serviceType}" රැකියාව සඳහා වෙනත් සේවකයෙකු තෝරාගෙන ඇත. ස්තූතියි. වෙනත් රැකියා බලන්න.`;
    } else if (language === 'ta') {
        body = `அன்பான ${fullName}, நீங்கள் ஏலம் கேட்ட "${serviceRequest.serviceType}" வேலைக்கு வேறொருவர் தேர்வு செய்யப்பட்டுள்ளார். நன்றி. பிற வேலைகளைப் பார்க்கவும்.`;
    } else {
        body = `Hi ${fullName}, the job "${serviceRequest.serviceType}" you bid on has been filled by another worker. Thank you for bidding. View other jobs on the Smart Service Platform.`;
    }
    return sendSMS(phone, body);
};

// Send notification to worker when job request they bidded on or are assigned to is updated
const sendJobUpdatedSMS = async (phone, fullName, serviceRequest, language = 'en') => {
    console.log(`[SMS Log] Preparing job update SMS for ${fullName} (${phone})`);
    let body;
    if (language === 'si') {
        body = `හිතවත් ${fullName}, ඔබ ලංසු තැබූ/සම්බන්ධ "${serviceRequest.serviceType}" රැකියාව යාවත්කාලීන කර ඇත. දිනය: ${serviceRequest.date} ${serviceRequest.time}. විස්තර පද්ධතියෙන් බලන්න.`;
    } else if (language === 'ta') {
        body = `அன்பான ${fullName}, நீங்கள் ஏலம் கேட்ட/நியமிக்கப்பட்ட "${serviceRequest.serviceType}" வேலை புதுப்பிக்கப்பட்டுள்ளது. தேதி: ${serviceRequest.date} ${serviceRequest.time}. விவரங்களைப் பார்க்கவும்.`;
    } else {
        body = `Hi ${fullName}, the job "${serviceRequest.serviceType}" you bid on/are assigned to has been updated. Date: ${serviceRequest.date} at ${serviceRequest.time}. Check details on the Smart Service Platform.`;
    }
    return sendSMS(phone, body);
};

module.exports = {
    sendNewJobSMS,
    sendBidRejectedSMS,
    sendJobUpdatedSMS
};
