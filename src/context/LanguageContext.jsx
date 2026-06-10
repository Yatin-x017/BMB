import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    appName: "Udhar Book",
    dashboard: "Dashboard",
    parties: "Parties",
    addEntry: "Add Entry",
    totalUdhar: "Total Udhar",
    totalClear: "Cleared",
    recentActivity: "Recent Activity",
    name: "Name",
    phone: "Phone",
    amount: "Amount",
    date: "Date",
    note: "Note",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    dena: "To Give",
    lena: "To Receive",
    balance: "Balance",
    payment: "Payment",
    udhar: "Udhar",
    noRecords: "No records found.",
    addParty: "Add Party",
    back: "Back",
    confirm: "Confirm",
    search: "Search...",
  },
  hi: {
    appName: "उधार बुक",
    dashboard: "डैशबोर्ड",
    parties: "पार्टियाँ",
    addEntry: "एंट्री जोड़ें",
    totalUdhar: "कुल उधार",
    totalClear: "चुकाया",
    recentActivity: "हाल की गतिविधि",
    name: "नाम",
    phone: "फ़ोन",
    amount: "राशि",
    date: "तारीख",
    note: "नोट",
    save: "सहेजें",
    cancel: "रद्द करें",
    edit: "संपादित करें",
    delete: "हटाएँ",
    dena: "देना है",
    lena: "लेना है",
    balance: "बकाया",
    payment: "भुगतान",
    udhar: "उधार",
    noRecords: "कोई रिकॉर्ड नहीं मिला।",
    addParty: "पार्टी जोड़ें",
    back: "वापस",
    confirm: "पुष्टि करें",
    search: "खोजें...",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const t = translations[lang];
  const toggleLang = () => setLang((l) => (l === "en" ? "hi" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);