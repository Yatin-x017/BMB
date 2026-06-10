import { Outlet, NavLink } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import "./Layout.css";

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

export default function Layout() {
  const { t, lang, toggleLang } = useLang();

  const navItems = [
    { to: "/",         label: t.dashboard, Icon: HomeIcon,   end: true },
    { to: "/parties",  label: t.parties,   Icon: PeopleIcon              },
    { to: "/add",      label: t.addEntry,  Icon: PlusIcon                },
  ];

  return (
    <div className="layout">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-badge">₹</span>
          <span className="brand-name">{t.appName}</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `nav-link${isActive ? " nav-link--active" : ""}`
              }
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="lang-toggle" onClick={toggleLang}>
          <span className={lang === "en" ? "lang-opt lang-opt--on" : "lang-opt"}>EN</span>
          <span className="lang-divider" />
          <span className={lang === "hi" ? "lang-opt lang-opt--on" : "lang-opt"}>हि</span>
        </button>
      </aside>

      {/* ── Page content ── */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ── Mobile bottom bar ── */}
      <nav className="mobile-nav">
        {navItems.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `mob-item${isActive ? " mob-item--active" : ""}`
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
        <button className="mob-lang" onClick={toggleLang}>
          {lang === "en" ? "हि" : "EN"}
        </button>
      </nav>

    </div>
  );
}