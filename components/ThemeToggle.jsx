import { useTheme } from "../context/ThemeContext";

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

/**
 * Theme toggle button.
 *
 * variant:
 *  - "sidebar" : pill switch with EN/HI-style segmented look, for the sidebar/mobile nav
 *  - "plain"   : minimal icon-only button, for the login screen / standalone use
 */
export default function ThemeToggle({ variant = "sidebar", style }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (variant === "mobile") {
    return (
      <button
        type="button"
        className="mob-theme"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    );
  }

  if (variant === "plain") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        title={isDark ? "Switch to light theme" : "Switch to dark theme"}
        style={{
          display: "grid",
          placeItems: "center",
          width: 36,
          height: 36,
          borderRadius: "var(--radius-sm)",
          border: "1.5px solid var(--border)",
          background: "var(--surface-2)",
          color: "var(--text-muted)",
          ...style,
        }}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className={!isDark ? "theme-opt theme-opt--on" : "theme-opt"}>
        <SunIcon />
      </span>
      <span className="theme-divider" />
      <span className={isDark ? "theme-opt theme-opt--on" : "theme-opt"}>
        <MoonIcon />
      </span>
    </button>
  );
}
