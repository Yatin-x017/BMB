import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import "./index.css";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Parties from "./pages/Parties";
import UdharDetail from "./pages/UdharDetail";
import AddEntry from "./pages/AddEntry";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="parties" element={<Parties />} />
            <Route path="parties/:id" element={<UdharDetail />} />
            <Route path="add" element={<AddEntry />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}