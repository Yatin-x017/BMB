import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";

import Button from "../components/Button";
import Input from "../components/Input";

import "./Login.css";

export default function Login() {
  const { signIn } = useAuth();

  const {
    t,
    lang,
    toggleLang,
  } = useLang();

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showPass, setShowPass] =
    useState(false);

  const handleSubmit = async () => {
    setError("");

    if (!email.trim()) {
      setError(t.emailRequired);
      return;
    }

    if (!password.trim()) {
      setError(t.passwordRequired);
      return;
    }

    if (password.length < 6) {
      setError(t.passwordShort);
      return;
    }

    setLoading(true);

    const { error: err } =
      await signIn(
        email.trim(),
        password
      );

    setLoading(false);

    if (err) {
      setError(err.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="login-page">

      {/* Branding Side */}

      <div className="login-brand">

        <div className="brand-content">

          <div className="brand-logo">
            ₹
          </div>

          <h1>
            Your Store's
            <br />
            Digital Khata
          </h1>

          <p>
            Track customer udhar,
            payments and balances
            from anywhere.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              ✓ Live synced data
            </div>

            <div className="feature-item">
              ✓ Customer balances
            </div>

            <div className="feature-item">
              ✓ Transaction history
            </div>

          </div>

        </div>

      </div>

      {/* Login Side */}

      <div className="login-panel">

        <div className="login-card">

          <button
            className="lang-toggle"
            onClick={toggleLang}
          >
            <span
              className={
                lang === "en"
                  ? "active"
                  : ""
              }
            >
              EN
            </span>

            <span>|</span>

            <span
              className={
                lang === "hi"
                  ? "active"
                  : ""
              }
            >
              हिन्दी
            </span>
          </button>

          <h2>
            {t.loginTitle}
          </h2>

          <p className="login-subtitle">
            {t.loginSubtitle}
          </p>

          <Input
            label={t.email}
            type="email"
            value={email}
            placeholder="store@example.com"
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <div className="password-wrap">

            <Input
              label={t.password}
              type={
                showPass
                  ? "text"
                  : "password"
              }
              value={password}
              placeholder="••••••••"
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

            <button
              className="password-toggle"
              onClick={() =>
                setShowPass(
                  (v) => !v
                )
              }
              type="button"
            >
              {showPass
                ? "Hide"
                : "Show"}
            </button>

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <Button
            onClick={handleSubmit}
          >
            {loading
              ? "Signing In..."
              : t.login}
          </Button>

          <p className="admin-note">
            {t.contactAdmin}
          </p>

        </div>

      </div>

    </div>
  );
}