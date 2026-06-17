import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";

import Layout    from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Parties   from "./pages/Parties";
import UdharDetail from "./pages/UdharDetail";
import AddEntry  from "./pages/AddEntry";
import NotFound  from "./pages/NotFound";
import Login     from "./pages/Login";

function PrivateRoute({ children }) {
  const { user } = useAuth();  
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route
                path="/login"
                element={<PublicRoute><Login /></PublicRoute>}
              />
              <Route
                path="/"
                element={<PrivateRoute><Layout /></PrivateRoute>}
              >
                <Route index          element={<Dashboard />} />
                <Route path="parties" element={<Parties />} />
                <Route path="parties/:id" element={<UdharDetail />} />
                <Route path="add"     element={<AddEntry />} />
                <Route path="*"       element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
