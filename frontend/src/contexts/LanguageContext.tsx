import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "si" | "ta";

interface Translations {
  [key: string]: {
    en: string;
    si: string;
    ta: string;
  };
}

const translations: Translations = {
  // ===== Navigation =====
  "Dashboard": { en: "Dashboard", si: "පුවරුව", ta: "டாஷ்போர்டு" },
  "Find Workers": { en: "Find Workers", si: "සේවකයින් සොයන්න", ta: "வேலையாட்களைக் கண்டறியவும்" },
  "My Requests": { en: "My Requests", si: "මගේ ඉල්ලීම්", ta: "எனது கோரிக்கைகள்" },
  "Messages": { en: "Messages", si: "පණිවිඩ", ta: "செய்திகள்" },
  "Profile": { en: "Profile", si: "පැතිකඩ", ta: "சுயவிவரம்" },
  "Settings": { en: "Settings", si: "සැකසුම්", ta: "அமைப்புகள்" },
  "Admin Dashboard": { en: "Admin Dashboard", si: "පරිපාලන පුවරුව", ta: "நிர்வாகி டாஷ்போர்டு" },
  "Activity Logs": { en: "Activity Logs", si: "ක්‍රියාකාරකම් සටහන්", ta: "செயல்பாட்டுப் பதிவுகள்" },
  "Logout": { en: "Logout", si: "පිටවීම", ta: "வெளியேறு" },
  "Job Requests": { en: "Job Requests", si: "රැකියා ඉල්ලීම්", ta: "வேலை கோரிக்கைகள்" },
  "Collapse": { en: "Collapse", si: "හකුළන්න", ta: "சுருக்கு" },
  "Service Requester": { en: "Service Requester", si: "සේවා ඉල්ලුම්කරු", ta: "சேவை கோருபவர்" },
  "Service Worker": { en: "Service Worker", si: "සේවා සපයන්නා", ta: "சேவை பணியாளர்" },
  "Broker/Manager": { en: "Broker/Manager", si: "තැරැව්කරු/කළමනාකරු", ta: "தரகர்/மேலாளர்" },
  "Administrator": { en: "Administrator", si: "පරිපාලක", ta: "நிர்வாகி" },

  // ===== General & Form Labels =====
  "Select Language": { en: "Select Language", si: "භාෂාව තෝරන්න", ta: "மொழியைத் தேர்ந்தெடுக்கவும்" },
  "Service Type": { en: "Service Type", si: "සේවා වර්ගය", ta: "சேவை வகை" },
  "Budget": { en: "Budget", si: "අයවැය", ta: "வரவுசெலவுத் திட்டம்" },
  "Location": { en: "Location", si: "ස්ථානය", ta: "இருப்பிடம்" },
  "Description": { en: "Description", si: "විස්තරය", ta: "விளக்கம்" },
  "Phone Number": { en: "Phone Number", si: "දුරකථන අංකය", ta: "தொலைபேசி எண்" },
  "Date": { en: "Date", si: "දිනය", ta: "தேதி" },
  "Time": { en: "Time", si: "වේලාව", ta: "நேரம்" },
  "Parts Required": { en: "Parts Required (Optional)", si: "අවශ්‍ය අමතර කොටස් (විකල්ප)", ta: "தேவைப்படும் பாகங்கள் (விருப்பத்திற்குரியது)" },
  "Submit": { en: "Submit", si: "ඉදිරිපත් කරන්න", ta: "சமர்ப்பிக்கவும்" },
  "Cancel": { en: "Cancel", si: "අවලංගු කරන්න", ta: "ரத்துசெய்" },
  "Create Request": { en: "Create Request", si: "නව ඉල්ලීමක්", ta: "கோரிக்கையை உருவாக்கு" },
  "Status": { en: "Status", si: "තත්ත්වය", ta: "நிலை" },
  "Bids": { en: "Bids", si: "ලංසු (Bids)", ta: "ஏலங்கள்" },
  "Action": { en: "Action", si: "ක්‍රියාව", ta: "செயல்" },
  "Skills": { en: "Skills", si: "නිපුණතා", ta: "திறன்கள்" },
  "Rating": { en: "Rating", si: "ප්‍රතිචාර ශ්‍රේණිගත කිරීම", ta: "மதிப்பீடு" },
  "Loading...": { en: "Loading...", si: "පූරණය වෙමින්...", ta: "ஏற்றுகிறது..." },
  "Error": { en: "Error", si: "දෝෂයකි", ta: "பிழை" },
  "Success": { en: "Success", si: "සාර්ථකයි", ta: "வெற்றி" },
  "Save Changes": { en: "Save Changes", si: "වෙනස්කම් සුරකින්න", ta: "மாற்றங்களைச் சேமிக்கவும்" },
  "Edit": { en: "Edit", si: "සංස්කරණය", ta: "திருத்தம்" },
  "Delete": { en: "Delete", si: "මකන්න", ta: "நீக்கு" },
  "View": { en: "View", si: "බලන්න", ta: "காண்க" },
  "Search": { en: "Search", si: "සොයන්න", ta: "தேடு" },
  "Filter": { en: "Filter", si: "පෙරන්න", ta: "வடிகட்டு" },
  "All": { en: "All", si: "සියල්ල", ta: "அனைத்தும்" },
  "Pending": { en: "Pending", si: "පොරොත්තුවෙන්", ta: "காத்திருக்கிறது" },
  "In Progress": { en: "In Progress", si: "සිදුකරමින් පවතින", ta: "செயல்பாட்டில் உள்ளது" },
  "Completed": { en: "Completed", si: "සම්පූර්ණ කරන ලද", ta: "நிறைவடைந்தது" },
  "N/A": { en: "N/A", si: "අදාළ නොවේ", ta: "பொருந்தாது" },

  // ===== Dashboard & Workers =====
  "Worker Dashboard": { en: "Worker Dashboard", si: "සේවක පුවරුව", ta: "பணியாளர் டாஷ்போர்டு" },
  "Available Jobs": { en: "Available Jobs", si: "පවතින රැකියා", ta: "கிடைக்கக்கூடிய வேலைகள்" },
  "My Jobs": { en: "My Jobs", si: "මගේ රැකියා", ta: "எனது வேலைகள்" },
  "No matched jobs found.": { en: "No matched jobs found.", si: "ගැලපෙන කිසිදු රැකියාවක් හමු නොවුණි.", ta: "பொருந்தக்கூடிய வேலைகள் எதுவும் கிடைக்கவில்லை." },
  "Place Bid": { en: "Place Bid", si: "ලංසුවක් තබන්න", ta: "ஏலம் கேட்கவும்" },
  "Bid Amount": { en: "Bid Amount", si: "ලංසු මුදල", ta: "ஏலத் தொகை" },
  "Submit Bid": { en: "Submit Bid", si: "ලංසුව ඉදිරිපත් කරන්න", ta: "ஏலத்தைச் சமர்ப்பிக்கவும்" },
  "Job Details": { en: "Job Details", si: "රැකියාවේ විස්තර", ta: "வேலை விவரங்கள்" },
  "Find Work": { en: "Find Work", si: "රැකියා සොයන්න", ta: "வேலையைக் கண்டறியவும்" },
  "Find jobs and manage your work": { en: "Find jobs and manage your work", si: "රැකියා සොයා ඔබේ කාර්යයන් කළමනාකරණය කරන්න", ta: "வேலைகளைக் கண்டறிந்து உங்கள் வேலையை நிர்வகிக்கவும்" },
  "Jobs Completed": { en: "Jobs Completed", si: "සම්පූර්ණ කරන ලද රැකියා", ta: "முடிவடைந்த வேலைகள்" },
  "Active Jobs": { en: "Active Jobs", si: "ක්‍රියාකාරී රැකියා", ta: "செயலில் உள்ள வேலைகள்" },
  "Your Rating": { en: "Your Rating", si: "ඔබේ ශ්‍රේණිගත කිරීම", ta: "உங்கள் மதிப்பீடு" },
  "Total Earnings": { en: "Total Earnings", si: "මුළු ඉපැයීම්", ta: "மொத்த வருவாய்" },
  "My Reviews": { en: "My Reviews", si: "මගේ සමාලෝචන", ta: "எனது மதிப்புரைகள்" },
  "Profile Completion": { en: "Profile Completion", si: "පැතිකඩ සම්පූර්ණත්වය", ta: "சுயவிவரப் பூர்த்தி" },
  "Complete Profile": { en: "Complete Profile", si: "පැතිකඩ සම්පූර්ණ කරන්න", ta: "சுயவிவரத்தை பூர்த்திசெய்யவும்" },
  "Recent Reviews": { en: "Recent Reviews", si: "මෑතකාලීන සමාලෝචන", ta: "சமீபத்திய மதிப்புரைகள்" },
  "No reviews yet.": { en: "No reviews yet.", si: "තවමත් සමාලෝචන නොමැත.", ta: "இன்னும் மதிப்புரைகள் இல்லை." },
  "Marketplace": { en: "Marketplace", si: "රැකියා පොළ", ta: "சந்தை" },
  "No jobs assigned or completed yet.": { en: "No jobs assigned or completed yet.", si: "තවම කිසිදු රැකියාවක් පැවරී හෝ සම්පූර්ණ වී නැත.", ta: "இதுவரை ஒதுக்கப்பட்ட அல்லது நிறைவடைந்த வேலைகள் இல்லை." },
  "Add more skills to attract more clients": { en: "Add more skills to attract more clients", si: "වැඩි ගනුදෙනුකරුවන් ආකර්ෂණය කිරීමට තවත් නිපුණතා එකතු කරන්න", ta: "கூடுதல் வாடிக்கையாளர்களை ஈர்க்க மேலும் திறன்களைச் சேர்க்கவும்" },

  // ===== Create Request Page =====
  "Create Service Request": { en: "Create Service Request", si: "නව සේවා ඉල්ලීමක් නිර්මාණය කරන්න", ta: "சேவை கோரிக்கையை உருவாக்கவும்" },
  "Request service from local skilled workers": { en: "Request service from local skilled workers", si: "දේශීය නිපුණ සේවකයින්ගෙන් සේවා ඉල්ලීම් කරන්න", ta: "உள்ளூர் திறமையான பணியாளர்களிடமிருந்து சேவையைக் கோரவும்" },
  "Post New Request": { en: "Post New Request", si: "නව ඉල්ලීමක් පළ කරන්න", ta: "புதிய கோரிக்கையை வெளியிடவும்" },
  "Fill in the details below to find a worker for your task.": { en: "Fill in the details below to find a worker for your task.", si: "ඔබේ කාර්යය සඳහා සේවකයෙකු සොයා ගැනීමට පහත විස්තර පුරවන්න.", ta: "உங்கள் பணிக்கான பணியாளரைக் கண்டறிய கீழே உள்ள விவரங்களை நிரப்பவும்." },
  "Service Details": { en: "Service Details", si: "සේවා විස්තර", ta: "சேவை விவரங்கள்" },
  "Provide clear information to get the best matches.": { en: "Provide clear information to get the best matches.", si: "හොඳම ගැලපීම් ලබා ගැනීමට පැහැදිලි තොරතුරු සපයන්න.", ta: "சிறந்த பொருத்தங்களைப் பெற தெளிவான தகவலை வழங்கவும்." },
  "Select a service type": { en: "Select a service type", si: "සේවා වර්ගය තෝරන්න", ta: "சேவை வகையைத் தேர்ந்தெடுக்கவும்" },
  "Plumbing": { en: "Plumbing", si: "නල පද්ධති (Plumbing)", ta: "குழாய் வேலை (Plumbing)" },
  "Electrical": { en: "Electrical", si: "විදුලි වැඩ (Electrical)", ta: "மின்சார வேலை (Electrical)" },
  "Cleaning": { en: "Cleaning", si: "පිරිසිදු කිරීම් (Cleaning)", ta: "துப்புரவு பணி (Cleaning)" },
  "Carpentry": { en: "Carpentry", si: "වඩු වැඩ (Carpentry)", ta: "தச்சு வேலை (Carpentry)" },
  "Gardening": { en: "Gardening", si: "වගා සහ ගෙවතු වැඩ (Gardening)", ta: "தோட்டக்கலை (Gardening)" },
  "Painting": { en: "Painting", si: "තීන්ත ආලේප කිරීම් (Painting)", ta: "வண்ணப்பூச்சு (Painting)" },
  "Moving": { en: "Moving", si: "ප්‍රවාහන කටයුතු (Moving)", ta: "இடம் பெயர்தல் (Moving)" },
  "Other": { en: "Other", si: "වෙනත් (Other)", ta: "மற்றவை (Other)" },
  "Describe the issue or task in detail...": { en: "Describe the issue or task in detail...", si: "ගැට්ලුව හෝ කාර්යය පිළිබඳ විස්තරාත්මකව සඳහන් කරන්න...", ta: "பிரச்சனை அல்லது பணியை விரிவாக விளக்கவும்..." },
  "List any parts or hardware needed...": { en: "List any parts or hardware needed...", si: "අවශ්‍ය වන අමතර කොටස් හෝ උපකරණ ලැයිස්තුගත කරන්න...", ta: "தேவைப்படும் பாகங்கள் அல்லது வன்பொருட்களைப் பட்டியலிடவும்..." },
  "Pin your location on the map below": { en: "Pin your location on the map below", si: "පහත සිතියමෙන් ඔබේ ස්ථානය ලකුණු කරන්න", ta: "கீழே உள்ள வரைபடத்தில் உங்கள் இருப்பிடத்தைக் குறிக்கவும்" },
  "Post Request": { en: "Post Request", si: "ඉල්ලීම පළ කරන්න", ta: "கோரிக்கையை வெளியிடவும்" },
  "Posting...": { en: "Posting...", si: "පළ කරමින්...", ta: "வெளியிடப்படுகிறது..." },
  "Enter location address": { en: "Enter location address", si: "ස්ථානයේ ලිපිනය ඇතුළත් කරන්න", ta: "இருப்பிட முகவரியை உள்ளிடவும்" },
  "Explain what needs to be done": { en: "Explain what needs to be done", si: "කළ යුතු කාර්යය පැහැදිලි කරන්න", ta: "என்ன செய்ய வேண்டும் என்பதை விளக்கவும்" },
  "List any parts that need to be purchased": { en: "List any parts that need to be purchased", si: "මිලදී ගත යුතු අමතර කොටස් ඇතුළත් කරන්න", ta: "வாங்க வேண்டிய பாகங்களை பட்டியலிடவும்" },
  "Creating Request...": { en: "Creating Request...", si: "ඉල්ලීම නිර්මාණය කරමින්...", ta: "கோரிக்கையை உருவாக்குகிறது..." },
  "Please add all required fields": { en: "Please add all required fields", si: "කරුණාකර අවශ්‍ය සියලුම ක්ෂේත්‍ර පුරවන්න", ta: "தேவையான அனைத்து விவரங்களையும் நிரப்பவும்" },
  "Request created successfully": { en: "Request created successfully", si: "සේවා ඉල්ලීම සාර්ථකව නිර්මාණය කරන ලදී", ta: "சேவை கோரிக்கை வெற்றிகரமாக உருவாக்கப்பட்டது" },

  // ===== Status types =====
  "pending": { en: "Pending", si: "පොරොත්තුවෙන්", ta: "காத்திருக்கிறது" },
  "in_progress": { en: "In Progress", si: "සිදුකරමින් පවතින", ta: "செயல்பாட்டில் உள்ளது" },
  "completed": { en: "Completed", si: "සම්පූර්ණ කරන ලද", ta: "நிறைவடைந்தது" },
  "approved": { en: "Approved", si: "අනුමත කරන ලද", ta: "அங்கீகரிக்கப்பட்டது" },
  "rejected": { en: "Rejected", si: "ප්‍රතික්ෂේපිත", ta: "நிராகரிக்கப்பட்டது" },

  // ===== Login Page =====
  "Welcome Back": { en: "Welcome Back", si: "නැවත සාදරයෙන් පිළිගනිමු", ta: "மீண்டும் வருக" },
  "Enter your email to sign in to your account": { en: "Enter your email to sign in to your account", si: "ඔබේ ගිණුමට පිවිසීමට ඔබේ විද්‍යුත් තැපෑල ඇතුළත් කරන්න", ta: "உங்கள் கணக்கில் உள்நுழைய உங்கள் மின்னஞ்சலை உள்ளிடவும்" },
  "Email": { en: "Email", si: "විද්‍යුත් තැපෑල", ta: "மின்னஞ்சல்" },
  "Password": { en: "Password", si: "මුරපදය", ta: "கடவுச்சொல்" },
  "Forgot password?": { en: "Forgot password?", si: "මුරපදය අමතකද?", ta: "கடவுச்சொல் மறந்துவிட்டதா?" },
  "Sign In": { en: "Sign In", si: "පිවිසෙන්න", ta: "உள்நுழையவும்" },
  "Signing in...": { en: "Signing in...", si: "පිවිසෙමින්...", ta: "உள்நுழைகிறது..." },
  "Don't have an account?": { en: "Don't have an account?", si: "ගිණුමක් නැද්ද?", ta: "கணக்கு இல்லையா?" },
  "Sign up": { en: "Sign up", si: "ලියාපදිංචි වන්න", ta: "பதிவு செய்யவும்" },
  "Welcome back!": { en: "Welcome back!", si: "නැවත සාදරයෙන් පිළිගනිමු!", ta: "மீண்டும் வருக!" },
  "Login successful.": { en: "Login successful.", si: "පිවිසීම සාර්ථකයි.", ta: "உள்நுழைவு வெற்றிகரம்." },
  "Login Failed": { en: "Login Failed", si: "පිවිසීම අසාර්ථකයි", ta: "உள்நுழைவு தோல்வி" },
  "Invalid credentials.": { en: "Invalid credentials.", si: "වලංගු නොවන හැඳුනුම්.", ta: "தவறான சான்றுகள்." },
  "An unexpected error occurred.": { en: "An unexpected error occurred.", si: "අනපේක්ෂිත දෝෂයක් ඇති විය.", ta: "எதிர்பாராத பிழை ஏற்பட்டது." },

  // ===== Register Page =====
  "Create an Account": { en: "Create an Account", si: "ගිණුමක් සාදන්න", ta: "கணக்கை உருவாக்கவும்" },
  "Enter your information to get started": { en: "Enter your information to get started", si: "ආරම්භ කිරීමට ඔබේ තොරතුරු ඇතුළත් කරන්න", ta: "தொடங்க உங்கள் தகவலை உள்ளிடவும்" },
  "Full Name": { en: "Full Name", si: "සම්පූර්ණ නම", ta: "முழு பெயர்" },
  "NIC": { en: "NIC", si: "ජාතික හැඳුනුම්පත", ta: "தேசிய அடையாள அட்டை" },
  "NIC Photo": { en: "NIC Photo", si: "ජාතික හැඳුනුම්පත් ඡායාරූපය", ta: "தேசிய அடையாள அட்டை புகைப்படம்" },
  "I want to be a...": { en: "I want to be a...", si: "මට අවශ්‍ය...", ta: "நான் ஆக விரும்புகிறேன்..." },
  "Select a role": { en: "Select a role", si: "භූමිකාවක් තෝරන්න", ta: "பங்கைத் தேர்ந்தெடுக்கவும்" },
  "Requester (Customer)": { en: "Requester (Customer)", si: "ඉල්ලුම්කරු (පාරිභෝගිකයා)", ta: "கோருபவர் (வாடிக்கையாளர்)" },
  "Worker (Service Provider)": { en: "Worker (Service Provider)", si: "සේවකයා (සේවා සපයන්නා)", ta: "பணியாளர் (சேவை வழங்குநர்)" },
  "Broker": { en: "Broker", si: "තැරැව්කරු", ta: "தரகர்" },
  "Select your Skill/Job Type": { en: "Select your Skill/Job Type", si: "ඔබේ නිපුණතාව/රැකියා වර්ගය තෝරන්න", ta: "உங்கள் திறன்/வேலை வகையைத் தேர்ந்தெடுக்கவும்" },
  "Select your main skill": { en: "Select your main skill", si: "ඔබේ ප්‍රධාන නිපුණතාව තෝරන්න", ta: "உங்கள் முக்கிய திறனைத் தேர்ந்தெடுக்கவும்" },
  "Please specify your skill": { en: "Please specify your skill", si: "කරුණාකර ඔබේ නිපුණතාව සඳහන් කරන්න", ta: "உங்கள் திறனைக் குறிப்பிடவும்" },
  "Working Photos": { en: "Working Photos", si: "වැඩ ඡායාරූප", ta: "வேலை புகைப்படங்கள்" },
  "GP Letters / Medical Certificates": { en: "GP Letters / Medical Certificates", si: "වෛද්‍ය සහතික / GP ලිපි", ta: "மருத்துவ சான்றிதழ்கள் / GP கடிதங்கள்" },
  "Address": { en: "Address", si: "ලිපිනය", ta: "முகவரி" },
  "Confirm Password": { en: "Confirm Password", si: "මුරපදය තහවුරු කරන්න", ta: "கடவுச்சொல்லை உறுதிப்படுத்தவும்" },
  "Sign Up": { en: "Sign Up", si: "ලියාපදිංචි වන්න", ta: "பதிவு செய்யவும்" },
  "Creating Account...": { en: "Creating Account...", si: "ගිණුම නිර්මාණය කරමින්...", ta: "கணக்கை உருவாக்குகிறது..." },
  "Already have an account?": { en: "Already have an account?", si: "දැනටමත් ගිණුමක් තිබේද?", ta: "ஏற்கனவே ஒரு கணக்கு உள்ளதா?" },
  "Sign in": { en: "Sign in", si: "පිවිසෙන්න", ta: "உள்நுழையவும்" },
  "Passwords do not match": { en: "Passwords do not match", si: "මුරපද නොගැලපේ", ta: "கடவுச்சொற்கள் பொருந்தவில்லை" },
  "Please ensure both passwords match.": { en: "Please ensure both passwords match.", si: "කරුණාකර මුරපද දෙකම ගැලපෙන බව තහවුරු කරන්න.", ta: "இரண்டு கடவுச்சொற்களும் பொருந்துவதை உறுதிசெய்யவும்." },
  "Location Required": { en: "Location Required", si: "ස්ථානය අවශ්‍යයි", ta: "இருப்பிடம் தேவை" },
  "Please select your location on the map.": { en: "Please select your location on the map.", si: "කරුණාකර සිතියමෙහි ඔබේ ස්ථානය තෝරන්න.", ta: "வரைபடத்தில் உங்கள் இருப்பிடத்தைத் தேர்ந்தெடுக்கவும்." },
  "NIC Photo Required": { en: "NIC Photo Required", si: "ජාතික හැඳුනුම්පත් ඡායාරූපය අවශ්‍යයි", ta: "தேசிய அடையாள அட்டை புகைப்படம் தேவை" },
  "Please upload a photo of your NIC.": { en: "Please upload a photo of your NIC.", si: "කරුණාකර ඔබේ ජාතික හැඳුනුම්පතේ ඡායාරූපයක් උඩුගත කරන්න.", ta: "உங்கள் தேசிய அடையாள அட்டையின் புகைப்படத்தைப் பதிவேற்றவும்." },
  "Registration Successful": { en: "Registration Successful", si: "ලියාපදිංචිය සාර්ථකයි", ta: "பதிவு வெற்றிகரம்" },
  "Your account has been created. Please wait for admin approval.": { en: "Your account has been created. Please wait for admin approval.", si: "ඔබේ ගිණුම නිර්මාණය කර ඇත. කරුණාකර පරිපාලක අනුමැතිය සඳහා රැඳී සිටින්න.", ta: "உங்கள் கணக்கு உருவாக்கப்பட்டது. நிர்வாகி ஒப்புதலுக்காக காத்திருக்கவும்." },
  "Registration Failed": { en: "Registration Failed", si: "ලියාපදිංචිය අසාර්ථකයි", ta: "பதிவு தோல்வி" },
  "Please upload a clear photo of your National Identity Card (Max 5MB)": { en: "Please upload a clear photo of your National Identity Card (Max 5MB)", si: "කරුණාකර ඔබේ ජාතික හැඳුනුම්පතේ පැහැදිලි ඡායාරූපයක් උඩුගත කරන්න (උපරිම 5MB)", ta: "தேசிய அடையாள அட்டையின் தெளிவான புகைப்படத்தைப் பதிவேற்றவும் (அதிகபட்சம் 5MB)" },
  "Upload photos of your completed work (Max 10MB each, at least 1 required)": { en: "Upload photos of your completed work (Max 10MB each, at least 1 required)", si: "ඔබේ සම්පූර්ණ කරන ලද වැඩවල ඡායාරූප උඩුගත කරන්න (එකක් උපරිම 10MB, අවම 1 අවශ්‍යයි)", ta: "உங்கள் முடிக்கப்பட்ட வேலையின் புகைப்படங்களைப் பதிவேற்றவும் (ஒவ்வொன்றும் அதிகபட்சம் 10MB, குறைந்தது 1 தேவை)" },
  "Upload GP letters or medical certificates (Images or PDFs, Max 10MB each, at least 1 required)": { en: "Upload GP letters or medical certificates (Images or PDFs, Max 10MB each, at least 1 required)", si: "වෛද්‍ය සහතික හෝ GP ලිපි උඩුගත කරන්න (රූප හෝ PDF, එකක් උපරිම 10MB, අවම 1 අවශ්‍යයි)", ta: "மருத்துவ சான்றிதழ்கள் அல்லது GP கடிதங்களைப் பதிவேற்றவும் (படங்கள் அல்லது PDFகள், ஒவ்வொன்றும் அதிகபட்சம் 10MB, குறைந்தது 1 தேவை)" },
  "Preview:": { en: "Preview:", si: "පෙරදසුන:", ta: "முன்னோட்டம்:" },

  // ===== Index / Landing Page =====
  "Smart Service Platform": { en: "Smart Service Platform", si: "ස්මාර්ට් සේවා වේදිකාව", ta: "ஸ்மார்ட் சேவை தளம்" },
  "Connect with": { en: "Connect with", si: "සම්බන්ධ වන්න", ta: "இணையவும்" },
  "Skilled Workers": { en: "Skilled Workers", si: "නිපුණ සේවකයින්", ta: "திறமையான பணியாளர்கள்" },
  "in Your Area": { en: "in Your Area", si: "ඔබේ ප්‍රදේශයේ", ta: "உங்கள் பகுதியில்" },
  "A location-based service request system for households, universities, and companies. Find verified workers instantly.": { en: "A location-based service request system for households, universities, and companies. Find verified workers instantly.", si: "නිවාස, විශ්ව විද්‍යාල සහ සමාගම් සඳහා ස්ථාන පදනම් සේවා ඉල්ලුම් පද්ධතිය. සත්‍යාපිත සේවකයින් ක්ෂණිකව සොයන්න.", ta: "வீடுகள், பல்கலைக்கழகங்கள் மற்றும் நிறுவனங்களுக்கான இருப்பிட அடிப்படையிலான சேவை கோரிக்கை அமைப்பு. சரிபார்க்கப்பட்ட பணியாளர்களை உடனடியாகக் கண்டறியவும்." },
  "Location-Based Matching": { en: "Location-Based Matching", si: "ස්ථාන පදනම් ගැලපීම", ta: "இருப்பிட அடிப்படையிலான பொருத்தம்" },
  "Find verified workers near you with real-time GPS tracking": { en: "Find verified workers near you with real-time GPS tracking", si: "තත්‍යකාලීන GPS ලුහුබැඳීම් සමඟ ඔබ ළඟ සත්‍යාපිත සේවකයින් සොයන්න", ta: "நிகழ்நேர GPS கண்காணிப்புடன் உங்களுக்கு அருகிலுள்ள சரிபார்க்கப்பட்ட பணியாளர்களைக் கண்டறியவும்" },
  "Verified Profiles": { en: "Verified Profiles", si: "සත්‍යාපිත පැතිකඩ", ta: "சரிபார்க்கப்பட்ட சுயவிவரங்கள்" },
  "All workers are verified for identity and skills": { en: "All workers are verified for identity and skills", si: "සියලුම සේවකයින් හැඳුනුම්පත හා නිපුණතා සඳහා සත්‍යාපනය කර ඇත", ta: "அனைத்து பணியாளர்களும் அடையாளம் மற்றும் திறன்களுக்காக சரிபார்க்கப்பட்டுள்ளனர்" },
  "Ratings & Reviews": { en: "Ratings & Reviews", si: "ශ්‍රේණිගත කිරීම් සහ සමාලෝචන", ta: "மதிப்பீடுகள் & மதிப்புரைகள்" },
  "Make informed decisions with transparent feedback": { en: "Make informed decisions with transparent feedback", si: "විනිවිද ප්‍රතිපෝෂණ සමඟ දැනුවත් තීරණ ගන්න", ta: "வெளிப்படையான கருத்துகளுடன் தகவலறிந்த முடிவுகளை எடுக்கவும்" },
  "Easy Job Management": { en: "Easy Job Management", si: "පහසු රැකියා කළමනාකරණය", ta: "எளிதான வேலை நிர்வாகம்" },
  "Track jobs from request to completion seamlessly": { en: "Track jobs from request to completion seamlessly", si: "ඉල්ලීමේ සිට සම්පූර්ණ කිරීම දක්වා රැකියා අඛණ්ඩව පසුහැරීම", ta: "கோரிக்கை முதல் நிறைவு வரை வேலைகளைத் தடையின்றி கண்காணிக்கவும்" },
  "Ready to Get Started?": { en: "Ready to Get Started?", si: "ආරම්භ කිරීමට සූදානම්ද?", ta: "தொடங்கத் தயாரா?" },
  "Join our community today as a service requester, worker, or broker.": { en: "Join our community today as a service requester, worker, or broker.", si: "අද සේවා ඉල්ලුම්කරුවෙකු, සේවකයෙකු හෝ තැරැව්කරුවෙකු ලෙස අපේ ප්‍රජාවට එකතු වන්න.", ta: "இன்றே சேவை கோருபவர், பணியாளர் அல்லது தரகர் என எங்கள் சமூகத்தில் இணையவும்." },
  "Location-Based Service System": { en: "Location-Based Service System", si: "ස්ථාන පදනම් සේවා පද්ධතිය", ta: "இருப்பிட அடிப்படையிலான சேவை அமைப்பு" },

  // ===== Forgot Password Page =====
  "Forgot Password": { en: "Forgot Password", si: "මුරපදය අමතක වුණා", ta: "கடவுச்சொல் மறந்துவிட்டது" },
  "Enter your email address and we'll send you a 6-digit OTP code valid for 10 minutes.": { en: "Enter your email address and we'll send you a 6-digit OTP code valid for 10 minutes.", si: "ඔබේ විද්‍යුත් තැපැල් ලිපිනය ඇතුළත් කරන්න. මිනිත්තු 10ක් වලංගු ඉලක්කම් 6ක OTP කේතයක් ඔබට එවනු ලැබේ.", ta: "உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும். 10 நிமிடங்களுக்கு செல்லுபடியான 6-இலக்க OTP குறியீடு உங்களுக்கு அனுப்பப்படும்." },
  "Enter the 6-digit OTP code sent to your email. The OTP is valid for 10 minutes.": { en: "Enter the 6-digit OTP code sent to your email. The OTP is valid for 10 minutes.", si: "ඔබේ විද්‍යුත් තැපෑලට එවන ලද ඉලක්කම් 6ක OTP කේතය ඇතුළත් කරන්න. OTP මිනිත්තු 10ක් වලංගුය.", ta: "உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்ட 6-இலக்க OTP குறியீட்டை உள்ளிடவும். OTP 10 நிமிடங்களுக்கு செல்லுபடியாகும்." },
  "Send OTP": { en: "Send OTP", si: "OTP එවන්න", ta: "OTP அனுப்பவும்" },
  "Enter 6-Digit OTP": { en: "Enter 6-Digit OTP", si: "ඉලක්කම් 6ක OTP ඇතුළත් කරන්න", ta: "6-இலக்க OTP உள்ளிடவும்" },
  "Verify OTP": { en: "Verify OTP", si: "OTP සත්‍යාපනය", ta: "OTP சரிபார்க்கவும்" },
  "Resend OTP": { en: "Resend OTP", si: "OTP නැවත එවන්න", ta: "OTP மீண்டும் அனுப்பவும்" },
  "Change Email": { en: "Change Email", si: "විද්‍යුත් තැපෑල වෙනස් කරන්න", ta: "மின்னஞ்சலை மாற்றவும்" },
  "Back to Login": { en: "Back to Login", si: "පිවිසුමට ආපසු", ta: "உள்நுழைவுக்குத் திரும்பவும்" },
  "OTP Sent": { en: "OTP Sent", si: "OTP එවන ලදී", ta: "OTP அனுப்பப்பட்டது" },
  "OTP Resent": { en: "OTP Resent", si: "OTP නැවත එවන ලදී", ta: "OTP மீண்டும் அனுப்பப்பட்டது" },
  "OTP Verified": { en: "OTP Verified", si: "OTP සත්‍යාපනය කරන ලදී", ta: "OTP சரிபார்க்கப்பட்டது" },
  "Please enter your new password.": { en: "Please enter your new password.", si: "කරුණාකර ඔබේ නව මුරපදය ඇතුළත් කරන්න.", ta: "உங்கள் புதிய கடவுச்சொல்லை உள்ளிடவும்." },
  "Invalid OTP": { en: "Invalid OTP", si: "වලංගු නොවන OTP", ta: "தவறான OTP" },
  "Please enter a 6-digit OTP.": { en: "Please enter a 6-digit OTP.", si: "කරුණාකර ඉලක්කම් 6ක OTP ඇතුළත් කරන්න.", ta: "6-இலக்க OTP உள்ளிடவும்." },
  "OTP Expired": { en: "OTP Expired", si: "OTP කල් ඉකුත් විය", ta: "OTP காலாவதியானது" },
  "The OTP has expired. Please request a new one.": { en: "The OTP has expired. Please request a new one.", si: "OTP කල් ඉකුත් වී ඇත. කරුණාකර නව එකක් ඉල්ලන්න.", ta: "OTP காலாவதியாகிவிட்டது. புதியதை கோரவும்." },

  // ===== Reset Password Page =====
  "Reset Password": { en: "Reset Password", si: "මුරපදය නැවත සකසන්න", ta: "கடவுச்சொல்லை மீட்டமைக்கவும்" },
  "Your OTP has been verified. Please enter your new password below.": { en: "Your OTP has been verified. Please enter your new password below.", si: "ඔබේ OTP සත්‍යාපනය කර ඇත. කරුණාකර ඔබේ නව මුරපදය පහත ඇතුළත් කරන්න.", ta: "உங்கள் OTP சரிபார்க்கப்பட்டது. உங்கள் புதிய கடவுச்சொல்லை கீழே உள்ளிடவும்." },
  "New Password": { en: "New Password", si: "නව මුරපදය", ta: "புதிய கடவுச்சொல்" },
  "Confirm New Password": { en: "Confirm New Password", si: "නව මුරපදය තහවුරු කරන්න", ta: "புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்" },
  "Invalid Access": { en: "Invalid Access", si: "වලංගු නොවන ප්‍රවේශය", ta: "தவறான அணுகல்" },
  "Please start the password reset process from the beginning.": { en: "Please start the password reset process from the beginning.", si: "කරුණාකර මුරපදය යළි පිහිටුවීමේ ක්‍රියාවලිය ආරම්භයේ සිට ආරම්භ කරන්න.", ta: "கடவுச்சொல் மீட்டமைப்பு செயல்முறையை ஆரம்பத்தில் இருந்து தொடங்கவும்." },
  "Password Reset Successful": { en: "Password Reset Successful", si: "මුරපදය යළි පිහිටුවීම සාර්ථකයි", ta: "கடவுச்சொல் மீட்டமைப்பு வெற்றிகரம்" },
  "You can now login with your new password.": { en: "You can now login with your new password.", si: "ඔබට දැන් ඔබේ නව මුරපදයෙන් පිවිසිය හැකිය.", ta: "நீங்கள் இப்போது உங்கள் புதிய கடவுச்சொல்லுடன் உள்நுழையலாம்." },
  "Password too short": { en: "Password too short", si: "මුරපදය ඉතා කෙටියි", ta: "கடவுச்சொல் மிகவும் குறுகியது" },
  "Password must be at least 6 characters.": { en: "Password must be at least 6 characters.", si: "මුරපදය අවම වශයෙන් අක්ෂර 6ක් විය යුතුය.", ta: "கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்." },

  // ===== Messages Page =====
  "Search messages...": { en: "Search messages...", si: "පණිවිඩ සොයන්න...", ta: "செய்திகளைத் தேடவும்..." },
  "No conversations yet.": { en: "No conversations yet.", si: "තවම සංවාද නොමැත.", ta: "இன்னும் உரையாடல்கள் இல்லை." },
  "Select a conversation or start a new message": { en: "Select a conversation or start a new message", si: "සංවාදයක් තෝරන්න හෝ නව පණිවිඩයක් ආරම්භ කරන්න", ta: "உரையாடலைத் தேர்ந்தெடுக்கவும் அல்லது புதிய செய்தியைத் தொடங்கவும்" },
  "Type a message...": { en: "Type a message...", si: "පණිවිඩයක් ටයිප් කරන්න...", ta: "ஒரு செய்தியைத் தட்டச்சு செய்யவும்..." },
  "Failed to load messages": { en: "Failed to load messages", si: "පණිවිඩ පූරණය අසාර්ථකයි", ta: "செய்திகளை ஏற்ற இயலவில்லை" },
  "Failed to send message": { en: "Failed to send message", si: "පණිවිඩය යැවීම අසාර්ථකයි", ta: "செய்தியை அனுப்ப இயலவில்லை" },

  // ===== My Requests Page =====
  "View and manage the service requests you have posted.": { en: "View and manage the service requests you have posted.", si: "ඔබ පළ කළ සේවා ඉල්ලීම් බලන්න සහ කළමනාකරණය කරන්න.", ta: "நீங்கள் வெளியிட்ட சேவை கோரிக்கைகளைப் பார்த்து நிர்வகிக்கவும்." },
  "Search your requests...": { en: "Search your requests...", si: "ඔබේ ඉල්ලීම් සොයන්න...", ta: "உங்கள் கோரிக்கைகளைத் தேடவும்..." },
  "No requests found.": { en: "No requests found.", si: "ඉල්ලීම් හමු නොවුණි.", ta: "கோரிக்கைகள் எதுவும் கிடைக்கவில்லை." },
  "Request Deleted": { en: "Request Deleted", si: "ඉල්ලීම මකා දමන ලදී", ta: "கோரிக்கை நீக்கப்பட்டது" },
  "The service request has been deleted.": { en: "The service request has been deleted.", si: "සේවා ඉල්ලීම මකා දමා ඇත.", ta: "சேவை கோரிக்கை நீக்கப்பட்டது." },
  "Failed to delete request.": { en: "Failed to delete request.", si: "ඉල්ලීම මැකීම අසාර්ථකයි.", ta: "கோரிக்கையை நீக்க இயலவில்லை." },
  "Job Completed": { en: "Job Completed", si: "රැකියාව සම්පූර්ණයි", ta: "வேலை முடிந்தது" },
  "The job has been marked as completed.": { en: "The job has been marked as completed.", si: "රැකියාව සම්පූර්ණ කරන ලද ලෙස සලකුණු කර ඇත.", ta: "வேலை நிறைவடைந்ததாகக் குறிக்கப்பட்டது." },
  "Failed to update status.": { en: "Failed to update status.", si: "තත්ත්වය යාවත්කාලීන කිරීම අසාර්ථකයි.", ta: "நிலையை புதுப்பிக்க இயலவில்லை." },
  "Review Submitted": { en: "Review Submitted", si: "සමාලෝචනය ඉදිරිපත් කරන ලදී", ta: "மதிப்புரை சமர்ப்பிக்கப்பட்டது" },
  "Thank you for your feedback!": { en: "Thank you for your feedback!", si: "ඔබගේ ප්‍රතිපෝෂණයට ස්තූතියි!", ta: "உங்கள் கருத்துக்கு நன்றி!" },
  "No worker assigned to rate.": { en: "No worker assigned to rate.", si: "ශ්‍රේණිගත කිරීමට සේවකයෙකු පවරා නැත.", ta: "மதிப்பிட பணியாளர் ஒதுக்கப்படவில்லை." },
  "Are you sure you want to delete this request?": { en: "Are you sure you want to delete this request?", si: "ඔබට මෙම ඉල්ලීම මැකීමට අවශ්‍ය බව විශ්වාසද?", ta: "இந்த கோரிக்கையை நீக்க விரும்புகிறீர்களா?" },
  "Mark this job as completed?": { en: "Mark this job as completed?", si: "මෙම රැකියාව සම්පූර්ණ ලෙස සලකුණු කරන්නද?", ta: "இந்த வேலையை நிறைவடைந்ததாகக் குறிக்கவா?" },

  // ===== Find Workers Page =====
  "Search and connect with skilled workers in your area": { en: "Search and connect with skilled workers in your area", si: "ඔබේ ප්‍රදේශයේ නිපුණ සේවකයින් සොයා සම්බන්ධ වන්න", ta: "உங்கள் பகுதியில் திறமையான பணியாளர்களைத் தேடி இணையவும்" },
  "Search workers by skill...": { en: "Search workers by skill...", si: "නිපුණතාවෙන් සේවකයින් සොයන්න...", ta: "திறன் மூலம் பணியாளர்களைத் தேடவும்..." },
  "Near Me": { en: "Near Me", si: "මට ළඟ", ta: "என் அருகில்" },
  "All Workers": { en: "All Workers", si: "සියලුම සේවකයින්", ta: "அனைத்து பணியாளர்கள்" },
  "No Nearby Workers Found": { en: "No Nearby Workers Found", si: "අසල සේවකයින් හමු නොවුණි", ta: "அருகிலுள்ள பணியாளர்கள் எதுவும் கிடைக்கவில்லை" },
  "Your location is not set": { en: "Your location is not set", si: "ඔබේ ස්ථානය සකසා නැත", ta: "உங்கள் இருப்பிடம் அமைக்கப்படவில்லை" },
  "Add Address in Profile": { en: "Add Address in Profile", si: "පැතිකඩෙහි ලිපිනය එකතු කරන්න", ta: "சுயவிவரத்தில் முகவரியைச் சேர்க்கவும்" },
  "View All Workers": { en: "View All Workers", si: "සියලුම සේවකයින් බලන්න", ta: "அனைத்து பணியாளர்களையும் காண்க" },
  "available": { en: "available", si: "ලබා ගත හැකි", ta: "கிடைக்கிறது" },
  "Failed to load workers.": { en: "Failed to load workers.", si: "සේවකයින් පූරණය අසාර්ථකයි.", ta: "பணியாளர்களை ஏற்ற இயலவில்லை." },

  // ===== Profile Page =====
  "My Profile": { en: "My Profile", si: "මගේ පැතිකඩ", ta: "எனது சுயவிவரம்" },
  "View your complete profile information": { en: "View your complete profile information", si: "ඔබේ සම්පූර්ණ පැතිකඩ තොරතුරු බලන්න", ta: "உங்கள் முழுமையான சுயவிவரத் தகவலைப் பார்க்கவும்" },
  "Profile Picture": { en: "Profile Picture", si: "පැතිකඩ ඡායාරූපය", ta: "சுயவிவரப் படம்" },
  "Your profile picture displayed across the platform": { en: "Your profile picture displayed across the platform", si: "වේදිකාව පුරා ප්‍රදර්ශිත ඔබේ පැතිකඩ ඡායාරූපය", ta: "தளம் முழுவதும் காட்டப்படும் உங்கள் சுயவிவரப் படம்" },
  "Change Picture": { en: "Change Picture", si: "ඡායාරූපය වෙනස් කරන්න", ta: "படத்தை மாற்றவும்" },
  "Upload Picture": { en: "Upload Picture", si: "ඡායාරූපය උඩුගත කරන්න", ta: "படத்தைப் பதிவேற்றவும்" },
  "Remove Picture": { en: "Remove Picture", si: "ඡායාරූපය ඉවත් කරන්න", ta: "படத்தை அகற்றவும்" },
  "Personal Information": { en: "Personal Information", si: "පුද්ගලික තොරතුරු", ta: "தனிப்பட்ட தகவல்" },
  "Your basic account details": { en: "Your basic account details", si: "ඔබේ මූලික ගිණුම් විස්තර", ta: "உங்கள் அடிப்படை கணக்கு விவரங்கள்" },
  "Edit Profile": { en: "Edit Profile", si: "පැතිකඩ සංස්කරණය", ta: "சுயவிவரத்தைத் திருத்தவும்" },
  "Phone": { en: "Phone", si: "දුරකථන", ta: "தொலைபேசி" },
  "Profile Image URL": { en: "Profile Image URL", si: "පැතිකඩ රූප URL", ta: "சுயவிவரப் பட URL" },
  "NIC Number": { en: "NIC Number", si: "ජා.හැ.ප. අංකය", ta: "தே.அ.அ. எண்" },
  "Role": { en: "Role", si: "භූමිකාව", ta: "பங்கு" },
  "Account Status": { en: "Account Status", si: "ගිණුම් තත්ත්වය", ta: "கணக்கு நிலை" },
  "Registered On": { en: "Registered On", si: "ලියාපදිංචි දිනය", ta: "பதிவு செய்யப்பட்ட தேதி" },
  "Rejected On": { en: "Rejected On", si: "ප්‍රතික්ෂේප කළ දිනය", ta: "நிராகரிக்கப்பட்ட தேதி" },
  "Your registered address": { en: "Your registered address", si: "ඔබේ ලියාපදිංචි ලිපිනය", ta: "உங்கள் பதிவுசெய்யப்பட்ட முகவரி" },
  "Your professional skills": { en: "Your professional skills", si: "ඔබේ වෘත්තීය නිපුණතා", ta: "உங்கள் தொழில்முறை திறன்கள்" },
  "No skills specified": { en: "No skills specified", si: "නිපුණතා සඳහන් කර නැත", ta: "திறன்கள் குறிப்பிடப்படவில்லை" },
  "Profile updated successfully": { en: "Profile updated successfully", si: "පැතිකඩ සාර්ථකව යාවත්කාලීන කරන ලදී", ta: "சுயவிவரம் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது" },
  "Failed to load profile": { en: "Failed to load profile", si: "පැතිකඩ පූරණය අසාර්ථකයි", ta: "சுயவிவரத்தை ஏற்ற இயலவில்லை" },
  "Specify Other Skill": { en: "Specify Other Skill", si: "වෙනත් නිපුණතාව සඳහන් කරන්න", ta: "மற்ற திறனைக் குறிப்பிடவும்" },
  "Select skill": { en: "Select skill", si: "නිපුණතාව තෝරන්න", ta: "திறனைத் தேர்ந்தெடுக்கவும்" },
  "Photos of your completed work": { en: "Photos of your completed work", si: "ඔබ සම්පූර්ණ කළ වැඩවල ඡායාරූප", ta: "உங்கள் முடிக்கப்பட்ட வேலையின் புகைப்படங்கள்" },
  "Medical certificates and GP letters": { en: "Medical certificates and GP letters", si: "වෛද්‍ය සහතික සහ GP ලිපි", ta: "மருத்துவ சான்றிதழ்கள் மற்றும் GP கடிதங்கள்" },
  "Your National Identity Card": { en: "Your National Identity Card", si: "ඔබේ ජාතික හැඳුනුම්පත", ta: "உங்கள் தேசிய அடையாள அட்டை" },
  "GP Letters": { en: "GP Letters", si: "GP ලිපි", ta: "GP கடிதங்கள்" },

  // ===== Requester Dashboard =====
  "Manage your service requests and find workers": { en: "Manage your service requests and find workers", si: "ඔබේ සේවා ඉල්ලීම් කළමනාකරණය කරන්න සහ සේවකයින් සොයන්න", ta: "உங்கள் சேவை கோரிக்கைகளை நிர்வகிக்கவும் மற்றும் பணியாளர்களைக் கண்டறியவும்" },
  "Active Requests": { en: "Active Requests", si: "ක්‍රියාකාරී ඉල්ලීම්", ta: "செயலில் உள்ள கோரிக்கைகள்" },
  "Completed Jobs": { en: "Completed Jobs", si: "සම්පූර්ණ කරන ලද රැකියා", ta: "நிறைவடைந்த வேலைகள்" },
  "Workers Hired": { en: "Workers Hired", si: "බඳවා ගත් සේවකයින්", ta: "பணியமர்த்தப்பட்ட பணியாளர்கள்" },
  "Search requests...": { en: "Search requests...", si: "ඉල්ලීම් සොයන්න...", ta: "கோரிக்கைகளைத் தேடவும்..." },
  "Failed to load your requests.": { en: "Failed to load your requests.", si: "ඔබේ ඉල්ලීම් පූරණය අසාර්ථකයි.", ta: "உங்கள் கோரிக்கைகளை ஏற்ற இயலவில்லை." },
  "No reviews yet. Workers can rate you after completing a job.": { en: "No reviews yet. Workers can rate you after completing a job.", si: "තවමත් සමාලෝචන නොමැත. සේවකයින්ට රැකියාවක් සම්පූර්ණ කිරීමෙන් පසු ඔබව ශ්‍රේණිගත කළ හැකිය.", ta: "இன்னும் மதிப்புரைகள் இல்லை. வேலையை முடித்த பிறகு பணியாளர்கள் உங்களை மதிப்பிடலாம்." },

  // ===== Broker Dashboard =====
  "Broker Dashboard": { en: "Broker Dashboard", si: "තැරැව්කරු පුවරුව", ta: "தரகர் டாஷ்போர்டு" },
  "Managed Workers": { en: "Managed Workers", si: "කළමනාකරණය කරන සේවකයින්", ta: "நிர்வகிக்கப்படும் பணியாளர்கள்" },
  "Market Opps": { en: "Market Opps", si: "වෙළඳපොළ අවස්ථා", ta: "சந்தை வாய்ப்புகள்" },
  "Overview": { en: "Overview", si: "සමස්ත දැක්ම", ta: "மேலோட்டம்" },
  "My Requests (Works)": { en: "My Requests (Works)", si: "මගේ ඉල්ලීම් (වැඩ)", ta: "எனது கோரிக்கைகள் (வேலைகள்)" },
  "All Available Jobs": { en: "All Available Jobs", si: "සියලුම පවතින රැකියා", ta: "கிடைக்கும் அனைத்து வேலைகள்" },
  "My Workers' Jobs (Work)": { en: "My Workers' Jobs (Work)", si: "මගේ සේවකයින්ගේ රැකියා (වැඩ)", ta: "எனது பணியாளர்களின் வேலைகள்" },
  "All Platform Requests": { en: "All Platform Requests", si: "සියලුම වේදිකා ඉල්ලීම්", ta: "அனைத்து தள கோரிக்கைகள்" },
  "Post Request": { en: "Post Request", si: "ඉල්ලීම පළ කරන්න", ta: "கோரிக்கையை வெளியிடவும்" },
  "New Request": { en: "New Request", si: "නව ඉල්ලීම", ta: "புதிய கோரிக்கை" },
  "Search workers...": { en: "Search workers...", si: "සේවකයින් සොයන්න...", ta: "பணியாளர்களைத் தேடவும்..." },
  "Worker": { en: "Worker", si: "සේවකයා", ta: "பணியாளர்" },
  "Active Jobs": { en: "Active Jobs", si: "ක්‍රියාකාරී රැකියා", ta: "செயலில் உள்ள வேலைகள்" },
  "Earnings": { en: "Earnings", si: "ඉපැයීම්", ta: "வருவாய்" },
  "View Profile": { en: "View Profile", si: "පැතිකඩ බලන්න", ta: "சுயவிவரத்தைக் காண்க" },
  "Apply for Job": { en: "Apply for Job", si: "රැකියාව සඳහා අයදුම් කරන්න", ta: "வேலைக்கு விண்ணப்பிக்கவும்" },
  "Recent Applications": { en: "Recent Applications", si: "මෑත අයදුම්පත්", ta: "சமீபத்திய விண்ணப்பங்கள்" },
  "View All Applications": { en: "View All Applications", si: "සියලුම අයදුම්පත් බලන්න", ta: "அனைத்து விண்ணப்பங்களையும் காண்க" },
  "No requests posted yet.": { en: "No requests posted yet.", si: "තවම ඉල්ලීම් පළ කර නැත.", ta: "இதுவரை கோரிக்கைகள் வெளியிடப்படவில்லை." },
  "No jobs available at the moment.": { en: "No jobs available at the moment.", si: "මේ මොහොතේ පවතින රැකියා නොමැත.", ta: "தற்போது வேலைகள் எதுவும் கிடைக்கவில்லை." },
  "No jobs assigned to your managed workers yet.": { en: "No jobs assigned to your managed workers yet.", si: "ඔබේ කළමනාකරණ සේවකයින්ට තවම රැකියා පවරා නැත.", ta: "உங்கள் நிர்வகிக்கப்படும் பணியாளர்களுக்கு இதுவரை வேலைகள் ஒதுக்கப்படவில்லை." },
  "No requests found on the platform.": { en: "No requests found on the platform.", si: "වේදිකාවේ ඉල්ලීම් හමු නොවුණි.", ta: "தளத்தில் கோரிக்கைகள் எதுவும் கிடைக்கவில்லை." },
  "Bid Accepted": { en: "Bid Accepted", si: "ලංසුව පිළිගන්නා ලදී", ta: "ஏலம் ஏற்றுக்கொள்ளப்பட்டது" },
  "The worker has been assigned. You can message them now.": { en: "The worker has been assigned. You can message them now.", si: "සේවකයා පවරා ඇත. ඔබට දැන් ඔවුන්ට පණිවිඩ යැවිය හැකිය.", ta: "பணியாளர் ஒதுக்கப்பட்டார். நீங்கள் இப்போது அவர்களுக்குச் செய்தி அனுப்பலாம்." },

  // ===== Admin Dashboard =====
  "Platform management and oversight": { en: "Platform management and oversight", si: "වේදිකා කළමනාකරණය සහ අධීක්ෂණය", ta: "தள நிர்வாகம் மற்றும் மேற்பார்வை" },
  "Total Users": { en: "Total Users", si: "මුළු පරිශීලකයින්", ta: "மொத்த பயனர்கள்" },
  "Active Workers": { en: "Active Workers", si: "ක්‍රියාකාරී සේවකයින්", ta: "செயலில் உள்ள பணியாளர்கள்" },
  "Pending Requests": { en: "Pending Requests", si: "පොරොත්තු ඉල්ලීම්", ta: "நிலுவையிலுள்ள கோரிக்கைகள்" },
  "Deletion Requests": { en: "Deletion Requests", si: "මකාදැමීමේ ඉල්ලීම්", ta: "நீக்குதல் கோரிக்கைகள்" },
  "Verification": { en: "Verification", si: "සත්‍යාපනය", ta: "சரிபார்ப்பு" },
  "User Management": { en: "User Management", si: "පරිශීලක කළමනාකරණය", ta: "பயனர் நிர்வாகம்" },
  "Account Deletion Requests": { en: "Account Deletion Requests", si: "ගිණුම් මකාදැමීමේ ඉල්ලීම්", ta: "கணக்கு நீக்குதல் கோரிக்கைகள்" },
  "All Reviews": { en: "All Reviews", si: "සියලුම සමාලෝචන", ta: "அனைத்து மதிப்புரைகள்" },
  "All Users": { en: "All Users", si: "සියලුම පරිශීලකයින්", ta: "அனைத்து பயனர்கள்" },
  "Applicant": { en: "Applicant", si: "අයදුම්කරු", ta: "விண்ணப்பதாரர்" },
  "Type": { en: "Type", si: "වර්ගය", ta: "வகை" },
  "Contact": { en: "Contact", si: "සම්බන්ධතා", ta: "தொடர்பு" },
  "Actions": { en: "Actions", si: "ක්‍රියා", ta: "செயல்கள்" },
  "No pending verifications": { en: "No pending verifications", si: "පොරොත්තු සත්‍යාපන නොමැත", ta: "நிலுவையில் சரிபார்ப்புகள் இல்லை" },
  "User Details": { en: "User Details", si: "පරිශීලක විස්තර", ta: "பயனர் விவரங்கள்" },
  "Complete information about the user": { en: "Complete information about the user", si: "පරිශීලකයා පිළිබඳ සම්පූර්ණ තොරතුරු", ta: "பயனர் பற்றிய முழுமையான தகவல்" },
  "User Profile Details": { en: "User Profile Details", si: "පරිශීලක පැතිකඩ විස්තර", ta: "பயனர் சுயவிவர விவரங்கள்" },
  "Editing User Details": { en: "Editing User Details", si: "පරිශීලක විස්තර සංස්කරණය", ta: "பயனர் விவரங்களைத் திருத்துதல்" },
  "Edit Details": { en: "Edit Details", si: "විස්තර සංස්කරණය", ta: "விவரங்களைத் திருத்தவும்" },
  "User Updated": { en: "User Updated", si: "පරිශීලකයා යාවත්කාලීන කරන ලදී", ta: "பயனர் புதுப்பிக்கப்பட்டார்" },
  "User details updated successfully.": { en: "User details updated successfully.", si: "පරිශීලක විස්තර සාර්ථකව යාවත්කාලීන කරන ලදී.", ta: "பயனர் விவரங்கள் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டன." },
  "User Deleted": { en: "User Deleted", si: "පරිශීලකයා මකා දමන ලදී", ta: "பயனர் நீக்கப்பட்டார்" },
  "System Reviews": { en: "System Reviews", si: "පද්ධති සමාලෝචන", ta: "அமைப்பு மதிப்புரைகள்" },
  "View all ratings and reviews across the platform": { en: "View all ratings and reviews across the platform", si: "වේදිකාව හරහා සියලුම ශ්‍රේණිගත කිරීම් සහ සමාලෝචන බලන්න", ta: "தளம் முழுவதும் அனைத்து மதிப்பீடுகள் மற்றும் மதிப்புரைகளைப் பார்க்கவும்" },
  "Reviewer": { en: "Reviewer", si: "සමාලෝචකයා", ta: "மதிப்பாய்வாளர்" },
  "Reviewee": { en: "Reviewee", si: "සමාලෝචිතයා", ta: "மதிப்பாய்வு செய்யப்பட்டவர்" },
  "Service": { en: "Service", si: "සේවාව", ta: "சேவை" },
  "Comment": { en: "Comment", si: "අදහස", ta: "கருத்து" },
  "No reviews found": { en: "No reviews found", si: "සමාලෝචන හමු නොවුණි", ta: "மதிப்புரைகள் எதுவும் கிடைக்கவில்லை" },
  "No deletion requests": { en: "No deletion requests", si: "මකාදැමීමේ ඉල්ලීම් නොමැත", ta: "நீக்குதல் கோரிக்கைகள் இல்லை" },
  "Review and manage user account deletion requests": { en: "Review and manage user account deletion requests", si: "පරිශීලක ගිණුම් මකාදැමීමේ ඉල්ලීම් සමාලෝචනය සහ කළමනාකරණය කරන්න", ta: "பயனர் கணக்கு நீக்குதல் கோரிக்கைகளை மதிப்பாய்வு செய்து நிர்வகிக்கவும்" },
  "Reason": { en: "Reason", si: "හේතුව", ta: "காரணம்" },
  "Requested": { en: "Requested", si: "ඉල්ලා ඇත", ta: "கோரப்பட்டது" },
  "Request Approved": { en: "Request Approved", si: "ඉල්ලීම අනුමත කරන ලදී", ta: "கோரிக்கை ஏற்றுக்கொள்ளப்பட்டது" },
  "Request Rejected": { en: "Request Rejected", si: "ඉල්ලීම ප්‍රතික්ෂේප කරන ලදී", ta: "கோரிக்கை நிராகரிக்கப்பட்டது" },

  // ===== Settings Page =====
  "Appearance": { en: "Appearance", si: "පෙනුම", ta: "தோற்றம்" },
  "Security": { en: "Security", si: "ආරක්ෂාව", ta: "பாதுகாப்பு" },
  "Documents": { en: "Documents", si: "ලේඛන", ta: "ஆவணங்கள்" },
  "Danger Zone": { en: "Danger Zone", si: "අනතුරු කලාපය", ta: "ஆபத்து மண்டலம்" },
  "Customize the look and feel of the application.": { en: "Customize the look and feel of the application.", si: "යෙදුමේ පෙනුම අභිරුචිකරණය කරන්න.", ta: "பயன்பாட்டின் தோற்றத்தையும் உணர்வையும் தனிப்பயனாக்கவும்." },
  "Theme Mode": { en: "Theme Mode", si: "තේමා ප්‍රකාරය", ta: "தீம் பயன்முறை" },
  "Select your preferred theme.": { en: "Select your preferred theme.", si: "ඔබ කැමති තේමාව තෝරන්න.", ta: "உங்களுக்கு விருப்பமான தீம் தேர்ந்தெடுக்கவும்." },
  "Change Password": { en: "Change Password", si: "මුරපදය වෙනස් කරන්න", ta: "கடவுச்சொல்லை மாற்றவும்" },
  "Update your password to keep your account secure.": { en: "Update your password to keep your account secure.", si: "ඔබේ ගිණුම ආරක්ෂිතව තබා ගැනීමට මුරපදය යාවත්කාලීන කරන්න.", ta: "உங்கள் கணக்கைப் பாதுகாப்பாக வைக்க கடவுச்சொல்லைப் புதுப்பிக்கவும்." },
  "Current Password": { en: "Current Password", si: "වත්මන් මුරපදය", ta: "தற்போதைய கடவுச்சொல்" },
  "Update Password": { en: "Update Password", si: "මුරපදය යාවත්කාලීන කරන්න", ta: "கடவுச்சொல்லைப் புதுப்பிக்கவும்" },
  "Updating...": { en: "Updating...", si: "යාවත්කාලීන කරමින්...", ta: "புதுப்பிக்கிறது..." },
  "Password updated successfully": { en: "Password updated successfully", si: "මුරපදය සාර්ථකව යාවත්කාලීන කරන ලදී", ta: "கடவுச்சொல் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது" },
  "Request Account Deletion": { en: "Request Account Deletion", si: "ගිණුම් මකාදැමීම් ඉල්ලීම", ta: "கணக்கு நீக்குதல் கோரிக்கை" },
  "Reason for Deletion (Required)": { en: "Reason for Deletion (Required)", si: "මකාදැමීමේ හේතුව (අවශ්‍යයි)", ta: "நீக்குவதற்கான காரணம் (தேவை)" },
  "Please provide a reason for account deletion": { en: "Please provide a reason for account deletion", si: "කරුණාකර ගිණුම් මකාදැමීමට හේතුවක් සපයන්න", ta: "கணக்கு நீக்குவதற்கான காரணத்தை வழங்கவும்" },
  "Submit Account Deletion Request?": { en: "Submit Account Deletion Request?", si: "ගිණුම් මකාදැමීම් ඉල්ලීම ඉදිරිපත් කරන්නද?", ta: "கணக்கு நீக்குதல் கோரிக்கையைச் சமர்ப்பிக்கவா?" },
  "Yes, submit request": { en: "Yes, submit request", si: "ඔව්, ඉල්ලීම ඉදිරිපත් කරන්න", ta: "ஆம், கோரிக்கையைச் சமர்ப்பிக்கவும்" },
  "Deletion Request Submitted": { en: "Deletion Request Submitted", si: "මකාදැමීම් ඉල්ලීම ඉදිරිපත් කරන ලදී", ta: "நீக்குதல் கோரிக்கை சமர்ப்பிக்கப்பட்டது" },
  "Upload Working Photos": { en: "Upload Working Photos", si: "වැඩ ඡායාරූප උඩුගත කරන්න", ta: "வேலை புகைப்படங்களைப் பதிவேற்றவும்" },
  "Upload GP Letters": { en: "Upload GP Letters", si: "GP ලිපි උඩුගත කරන්න", ta: "GP கடிதங்களைப் பதிவேற்றவும்" },

  // ===== NotFound Page =====
  "Page Not Found": { en: "Page Not Found", si: "පිටුව හමු නොවුණි", ta: "பக்கம் கிடைக்கவில்லை" },
  "Go Home": { en: "Go Home", si: "මුල් පිටුවට", ta: "முகப்புக்குச் செல்லவும்" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language");
    return (saved === "si" ? "si" : saved === "ta" ? "ta" : "en") as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (item) {
      return item[language];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
