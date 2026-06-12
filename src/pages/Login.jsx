import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

export default function Login() {
  const { signIn }              = useAuth();
  const { t, lang, toggleLang } = useLang();
  const navigate                = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim())    { setError(t.emailRequired);    return; }
    if (!password.trim()) { setError(t.passwordRequired); return; }
    if (password.length < 6) { setError(t.passwordShort); return; }

    setLoading(true);
    const { error: err } = await signIn(email.trim(), password);
    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div style={s.wrap}>
      {/* Left panel — branding */}
      <div style={s.left}>
        <div style={s.leftInner}>
          <div style={s.brandRow}>
            <span style={s.badge}>₹</span>
          </div>
          <h1 style={s.tagline}>Your store's<br />digital khata.</h1>
          <p style={s.taglineSub}>
            Track udhar, advance payments, and customer balances — all in one place.
          </p>
          <div style={s.featureList}>
            {[
              "All employees see the same live data",
              "Track udhar & advance per customer",
              "Complete transaction history",
            ].map((f) => (
              <div key={f} style={s.featureItem}>
                <span style={s.featureDot}>✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div style={s.right}>
        <div style={s.card}>

          {/* Lang toggle */}
          <button style={s.langBtn} onClick={toggleLang}>
            <span style={lang === "en" ? s.langOn : s.langOff}>EN</span>
            <span style={s.langDivider} />
            <span style={lang === "hi" ? s.langOn : s.langOff}>हि</span>
          </button>

          <h2 style={s.title}>{t.loginTitle}</h2>
          <p style={s.subtitle}>{t.loginSubtitle}</p>

          {/* Email */}
          <div style={s.fieldGroup}>
            <label style={s.label}>{t.email}</label>
            <input
              style={s.input}
              type="email"
              placeholder="store@example.com"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Password */}
          <div style={{ ...s.fieldGroup, position: 'relative' }}>
            <label style={s.label}>{t.password}</label>
            <input
              style={s.input}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              style={s.eyeBtn}
              onClick={() => setShowPass((v) => !v)}
              tabIndex={-1}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={s.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Submit */}
          <button
            style={{ ...s.btn, opacity: loading ? 0.75 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Signing in…" : t.login}
          </button>

          {/* Admin note */}
          <p style={s.adminNote}>{t.contactAdmin}</p>

        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
  },

  /* Left branding panel */
  left: {
    flex: "0 0 45%",
    background: "var(--sidebar)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
  },
  leftInner: {
    maxWidth: 360,
  },
  brandRow: {
    marginBottom: 32,
  },
  badge: {
    display: "inline-grid",
    placeItems: "center",
    width: 52,
    height: 52,
    background: "var(--accent)",
    color: "#fff",
    borderRadius: 14,
    fontSize: 26,
    fontWeight: 800,
  },
  tagline: {
    fontSize: 36,
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.15,
    letterSpacing: "-0.5px",
    marginBottom: 14,
  },
  taglineSub: {
    fontSize: 15,
    color: "var(--sidebar-text)",
    lineHeight: 1.6,
    marginBottom: 32,
  },
  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    fontSize: 14,
    color: "#94A3B8",
    lineHeight: 1.4,
  },
  featureDot: {
    color: "var(--accent)",
    fontWeight: 700,
    flexShrink: 0,
    marginTop: 1,
  },

  /* Right form panel */
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--bg)",
    padding: "40px 24px",
  },
  card: {
    background: "var(--surface)",
    borderRadius: "var(--radius-lg)",
    border: "1.5px solid var(--border)",
    padding: "36px 32px",
    width: "100%",
    maxWidth: 400,
    boxShadow: "var(--shadow-lg)",
    position: "relative",
  },

  langBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 28,
    background: "var(--surface-2)",
    border: "1.5px solid var(--border)",
    borderRadius: 20,
    padding: "6px 14px",
    cursor: "pointer",
    fontFamily: "var(--font)",
  },
  langOn:      { fontSize: 12, fontWeight: 700, color: "var(--accent-dark)" },
  langOff:     { fontSize: 12, fontWeight: 600, color: "var(--text-muted)" },
  langDivider: { width: 1, height: 12, background: "var(--border)" },

  title: {
    fontSize: 24,
    fontWeight: 800,
    color: "var(--text)",
    marginBottom: 6,
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: 14,
    color: "var(--text-muted)",
    marginBottom: 28,
    lineHeight: 1.5,
  },

  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "var(--text-muted)",
    marginBottom: 7,
    textTransform: "uppercase",
    letterSpacing: "0.4px",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid var(--border)",
    borderRadius: "var(--radius)",
    fontSize: 14,
    color: "var(--text)",
    background: "var(--surface-2)",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    bottom: 10,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    padding: "2px 4px",
  },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "var(--red)",
    color: "var(--red-dark)",
    fontSize: 13,
    fontWeight: 500,
    padding: "10px 14px",
    borderRadius: "var(--radius-sm)",
    marginBottom: 16,
  },

  btn: {
    display: "block",
    width: "100%",
    padding: "13px",
    borderRadius: "var(--radius)",
    border: "none",
    background: "var(--sidebar)",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.15s",
    letterSpacing: "-0.1px",
  },

  adminNote: {
    fontSize: 12,
    color: "var(--text-faint)",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 1.5,
  },
};
