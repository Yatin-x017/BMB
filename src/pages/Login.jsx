import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

export default function Login() {
  const { signIn, signUp }      = useAuth();
  const { t, lang, toggleLang } = useLang();
  const navigate                = useNavigate();

  const [isSignUp,    setIsSignUp]    = useState(false);
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [successMsg,  setSuccessMsg]  = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccessMsg("");

    if (!email.trim())    { setError(t.emailRequired);    return; }
    if (!password.trim()) { setError(t.passwordRequired); return; }
    if (password.length < 6) { setError(t.passwordShort); return; }

    setLoading(true);
    const { error: err } = isSignUp
      ? await signUp(email.trim(), password)
      : await signIn(email.trim(), password);
    setLoading(false);

    if (err) {
      setError(err.message);
    } else if (isSignUp) {
      setSuccessMsg(t.checkEmail);
    } else {
      navigate("/");
    }
  };

  const switchMode = () => {
    setIsSignUp((v) => !v);
    setError("");
    setSuccessMsg("");
  };

  return (
    <div style={s.wrap}>
      <div style={s.card}>

        {/* Brand */}
        <div style={s.brand}>
          <span style={s.badge}>₹</span>
          <span style={s.appName}>{t.appName}</span>
        </div>

        <h1 style={s.title}>{isSignUp ? t.signUp : t.login}</h1>
        <p style={s.subtitle}>{isSignUp ? t.signUpSubtitle : t.loginSubtitle}</p>

        {/* Email */}
        <label style={s.label}>{t.email}</label>
        <input
          style={s.input}
          type="email"
          placeholder="you@example.com"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {/* Password */}
        <label style={{ ...s.label, marginTop: 14 }}>{t.password}</label>
        <input
          style={s.input}
          type="password"
          placeholder="••••••••"
          value={password}
          autoComplete={isSignUp ? "new-password" : "current-password"}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {/* Feedback */}
        {error      && <p style={s.error}>{error}</p>}
        {successMsg && <p style={s.success}>{successMsg}</p>}

        {/* Submit */}
        <button
          style={{ ...s.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "..." : (isSignUp ? t.signUp : t.login)}
        </button>

        {/* Mode switch */}
        <button style={s.switchBtn} onClick={switchMode}>
          {isSignUp ? t.alreadyHaveAccount : t.noAccount}
        </button>

        {/* Language toggle */}
        <button style={s.langBtn} onClick={toggleLang}>
          <span style={lang === "en" ? s.langOn : s.langOff}>EN</span>
          <span style={s.langDivider} />
          <span style={lang === "hi" ? s.langOn : s.langOff}>हि</span>
        </button>

      </div>
    </div>
  );
}

const s = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    padding: "20px",
  },
  card: {
    background: "var(--surface)",
    borderRadius: "var(--radius)",
    border: "1.5px solid var(--border)",
    padding: "32px 28px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "var(--shadow)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 28,
  },
  badge: {
    width: 40,
    height: 40,
    background: "var(--primary-light)",
    color: "var(--primary-dark)",
    borderRadius: 11,
    display: "grid",
    placeItems: "center",
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },
  appName: {
    fontSize: 18,
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.4px",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "var(--text)",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "var(--text-muted)",
    marginBottom: 24,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-muted)",
    marginBottom: 6,
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px 12px",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius)",
    fontSize: 14,
    color: "var(--text)",
    background: "var(--bg)",
    outline: "none",
    boxSizing: "border-box",
  },
  error: {
    color: "var(--red-dark)",
    fontSize: 12,
    marginTop: 12,
  },
  success: {
    color: "var(--green-dark)",
    fontSize: 12,
    marginTop: 12,
    background: "var(--green)",
    padding: "10px 12px",
    borderRadius: 8,
    lineHeight: 1.5,
  },
  btn: {
    display: "block",
    width: "100%",
    marginTop: 20,
    padding: "12px",
    borderRadius: "var(--radius)",
    border: "none",
    background: "var(--primary-dark)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  switchBtn: {
    display: "block",
    width: "100%",
    marginTop: 12,
    background: "none",
    border: "none",
    color: "var(--primary-dark)",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    padding: "6px",
    textAlign: "center",
  },
  langBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: "18px auto 0",
    padding: "7px 18px",
    border: "1.5px solid var(--border)",
    borderRadius: 20,
    background: "none",
    cursor: "pointer",
    fontFamily: "var(--font)",
  },
  langOn:      { fontSize: 13, fontWeight: 700, color: "var(--primary-dark)" },
  langOff:     { fontSize: 13, fontWeight: 600, color: "var(--text-muted)" },
  langDivider: { width: 1, height: 14, background: "var(--border)" },
};
