import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    appName:   "Khata Book",
    storeName: "Store Ledger",
    dashboard: "Dashboard",
    parties:   "Customers",
    addEntry:  "New Entry",
    totalUdhar:   "Total Receivable",
    totalAdvance: "Total Advance",
    recentActivity: "Recent Activity",
    name:   "Name",
    phone:  "Phone",
    amount: "Amount (₹)",
    date:   "Date",
    note:   "Note / Remark",
    save:   "Save Entry",
    cancel: "Cancel",
    edit:   "Edit",
    delete: "Delete",
    advance: "Advance",
    lena:    "To Receive",
    balance:  "Balance",
    payment:  "Payment",
    udhar:    "Udhar",
    settled:  "Settled",
    noRecords: "No records yet.",
    addParty:  "Add Customer",
    back:      "Back",
    confirm:   "Confirm",
    search:    "Search by name or phone…",
    loading:   "Loading…",
    all:       "All",
    filter:    "Filter",
    deleteEntry: "Delete Entry",
    confirmDelete: "Are you sure?",
    deleteParty: "Delete Customer",
    runningBalance: "Running Balance",
    // ── Auth ──
    login:    "Sign In",
    logout:   "Sign Out",
    email:    "Email",
    password: "Password",
    loginTitle:    "Welcome back",
    loginSubtitle: "Sign in to your store's khata book",
    emailRequired:    "Email is required",
    passwordRequired: "Password is required",
    passwordShort:    "Password must be at least 6 characters",
    loggedInAs: "Logged in as",
    contactAdmin: "Contact your store manager to get access.",
  },
  hi: {
    appName:   "खाता बुक",
    storeName: "स्टोर लेजर",
    dashboard: "डैशबोर्ड",
    parties:   "ग्राहक",
    addEntry:  "नई एंट्री",
    totalUdhar:   "कुल उधार",
    totalAdvance: "कुल एडवांस",
    recentActivity: "हाल की गतिविधि",
    name:   "नाम",
    phone:  "फ़ोन",
    amount: "राशि (₹)",
    date:   "तारीख",
    note:   "नोट / टिप्पणी",
    save:   "एंट्री सेव करें",
    cancel: "रद्द करें",
    edit:   "संपादित करें",
    delete: "हटाएँ",
    advance: "एडवांस",
    lena:    "लेना है",
    balance:  "बकाया",
    payment:  "भुगतान",
    udhar:    "उधार",
    settled:  "चुका दिया",
    noRecords: "कोई रिकॉर्ड नहीं।",
    addParty:  "ग्राहक जोड़ें",
    back:      "वापस",
    confirm:   "पुष्टि करें",
    search:    "नाम या फ़ोन से खोजें…",
    loading:   "लोड हो रहा है…",
    all:       "सभी",
    filter:    "फ़िल्टर",
    deleteEntry: "एंट्री हटाएँ",
    confirmDelete: "क्या आप sure हैं?",
    deleteParty: "ग्राहक हटाएँ",
    runningBalance: "चालू बकाया",
    // ── Auth ──
    login:    "लॉग इन",
    logout:   "लॉग आउट",
    email:    "ईमेल",
    password: "पासवर्ड",
    loginTitle:    "स्वागत है",
    loginSubtitle: "अपने स्टोर की खाता बुक में लॉग इन करें",
    emailRequired:    "ईमेल आवश्यक है",
    passwordRequired: "पासवर्ड आवश्यक है",
    passwordShort:    "पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
    loggedInAs: "लॉग इन है",
    contactAdmin: "एक्सेस के लिए अपने स्टोर मैनेजर से संपर्क करें।",
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
