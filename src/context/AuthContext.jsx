import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate session on first load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Keep in sync with Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn  = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp  = (email, password) =>
    supabase.auth.signUp({ email, password });

  const signOut = () => supabase.auth.signOut();

  // Splash screen while auth state is resolving — prevents flash of login page
  if (loading) {
    return (
      <div style={splash}>
        <div style={badge}>₹</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

const splash = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--bg)",
};

const badge = {
  width: 52,
  height: 52,
  background: "var(--primary-light)",
  color: "var(--primary-dark)",
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  fontSize: 26,
  fontWeight: 700,
  animation: "pulse 1.4s ease-in-out infinite",
};
