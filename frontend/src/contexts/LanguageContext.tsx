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
  // Navigation
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

  // General & Form Labels
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
  
  // Dashboard & Workers
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
  
  // Create Request Page
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
  "Describe the issue or task in detail...": { en: "Describe the issue or task in detail...", si: "ගැட்டලුව හෝ කාර්යය පිළිබඳ විස්තරාත්මකව සඳහன் කරන්න...", ta: "பிரச்சனை அல்லது பணியை விரிவாக விளக்கவும்..." },
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
  
  // Status types
  "pending": { en: "Pending", si: "පෙරදසුන / පොරොත්තුවෙන්", ta: "காத்திருக்கிறது" },
  "in_progress": { en: "In Progress", si: "සිදුකරමින් පවතින", ta: "செயல்பாட்டில் உள்ளது" },
  "completed": { en: "Completed", si: "සම්පූර්ණ කරන ලද", ta: "நிறைவடைந்தது" },
  "approved": { en: "Approved", si: "අනුමත කරන ලද", ta: "அங்கீகரிக்கப்பட்டது" },
  "rejected": { en: "Rejected", si: "ප්‍රතික්ෂේපිත", ta: "நிராகரிக்கப்பட்டது" },
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
