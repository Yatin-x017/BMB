import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    appName:   "Udhar Book",
    dashboard: "Dashboard",
    parties:   "Parties",
    addEntry:  "Add Entry",
    totalUdhar: "Total Udhar",
    totalClear: "Cleared",
    recentActivity: "Recent Activity",
    name:   "Name",
    phone:  "Phone",
    amount: "Amount",
    date:   "Date",
    note:   "Note",
    save:   "Save",
    cancel: "Cancel",
    edit:   "Edit",
    delete: "Delete",
    dena:   "To Give",
    lena:   "To Receive",
    balance:  "Balance",
    payment:  "Payment",
    udhar:    "Udhar",
    noRecords: "No records found.",
    addParty:  "Add Party",
    back:      "Back",
    confirm:   "Confirm",
    search:    "Search...",
    loading:   "Loading...",
    // ── Auth ──
    login:    "Log In",
    signUp:   "Sign Up",
    logout:   "Log Out",
    email:    "Email",
    password: "Password",
    loginSubtitle:   "Welcome back to your udhar book",
    signUpSubtitle:  "Create your free account",
    alreadyHaveAccount: "Already have an account? Log in",
    noAccount:          "Don't have an account? Sign up",
    checkEmail:   "Account created! Check your email to verify before logging in.",
    emailRequired:    "Email is required",
    passwordRequired: "Password is required",
    passwordShort:    "Password must be at least 6 characters",
    loggedInAs: "Logged in as",
  },
  hi: {
    appName:   "उधार बुक",
    dashboard: "डैशबोर्ड",
    parties:   "पार्टियाँ",
    addEntry:  "एंट्री जोड़ें",
    totalUdhar: "कुल उधार",
    totalClear: "चुकाया",
    recentActivity: "हाल की गतिविधि",
    name:   "नाम",
    phone:  "फ़ोन",
    amount: "राशि",
    date:   "तारीख",
    note:   "नोट",
    save:   "सहेजें",
    cancel: "रद्द करें",
    edit:   "संपादित करें",
    delete: "हटाएँ",
    dena:   "देना है",
    lena:   "लेना है",
    balance:  "बकाया",
    payment:  "भुगतान",
    udhar:    "उधार",
    noRecords: "कोई रिकॉर्ड नहीं मिला।",
    addParty:  "पार्टी जोड़ें",
    back:      "वापस",
    confirm:   "पुष्टि करें",
    search:    "खोजें...",
    loading:   "लोड हो रहा है...",
    // ── Auth ──
    login:    "लॉग इन",
    signUp:   "साइन अप",
    logout:   "लॉग आउट",
    email:    "ईमेल",
    password: "पासवर्ड",
    loginSubtitle:   "अपनी उधार बुक में वापस स्वागत है",
    signUpSubtitle:  "मुफ़्त खाता बनाएं",
    alreadyHaveAccount: "पहले से खाता है? लॉग इन करें",
    noAccount:          "खाता नहीं है? साइन अप करें",
    checkEmail:   "खाता बना! लॉग इन से पहले ईमेल वेरीफाई करें।",
    emailRequired:    "ईमेल आवश्यक है",
    passwordRequired: "पासवर्ड आवश्यक है",
    passwordShort:    "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
    loggedInAs: "लॉग इन है",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t          = translations[lang];
  const toggleLang = () => setLang((l) => (l === "en" ? "hi" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
