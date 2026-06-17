import { useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useLang } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import useStore from "../store/useStore";
import ThemeToggle from "./ThemeToggle";
import "./Layout.css";

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const PeopleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

export default function Layout() {
  const { t, lang, toggleLang } = useLang();
  const { user, signOut }       = useAuth();
  const { fetchAll, reset, subscribe, unsubscribe, connected } = useStore();
  const navigate                = useNavigate();

  useEffect(() => {
    fetchAll();
    subscribe();
    return () => unsubscribe();
  }, []); // eslint-disable-line

  const handleLogout = async () => {
    reset();
    await signOut();
    navigate("/login");
  };

  const navItems = [
    { to: "/",        label: t.dashboard, Icon: HomeIcon,   end: true },
    { to: "/parties", label: t.parties,   Icon: PeopleIcon            },
    { to: "/add",     label: t.addEntry,  Icon: PlusIcon              },
  ];

  const emailDisplay = user?.email?.length > 24
    ? user.email.slice(0, 24) + "…"
    : user?.email;

  return (
    <div className="layout">

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-badge">₹</span>
          <div>
            <div className="brand-name">{t.appName}</div>
            <div className="brand-subtitle">{t.storeName}</div>
          </div>
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

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="user-avatar">{user?.email?.[0]?.toUpperCase() ?? "?"}</div>
            <div className="user-info">
              <span className="user-label">{t.loggedInAs}</span>
              <span className="user-email">{emailDisplay}</span>
            </div>
            <span
              className={`sync-dot${connected ? " sync-dot--live" : ""}`}
              title={connected ? "Live — synced with all employees" : "Connecting…"}
            />
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOutIcon />
            {t.logout}
          </button>

          <div className="footer-toggles">
            <ThemeToggle />
            <button className="lang-toggle" onClick={toggleLang}>
              <span className={lang === "en" ? "lang-opt lang-opt--on" : "lang-opt"}>EN</span>
              <span className="lang-divider" />
              <span className={lang === "hi" ? "lang-opt lang-opt--on" : "lang-opt"}>हि</span>
            </button>
          </div>
        </div>
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
        <ThemeToggle variant="mobile" />
        <button className="mob-lang" onClick={toggleLang}>
          {lang === "en" ? "हि" : "EN"}
        </button>
        <button className="mob-logout" onClick={handleLogout} title={t.logout}>
          <LogOutIcon />
        </button>
      </nav>

    </div>
  );
}
