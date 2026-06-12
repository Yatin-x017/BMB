import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import useStore from '../store/useStore';

const fmt = (n) => `₹${Math.abs(n).toLocaleString('en-IN')}`;

const TABS = [
  { key: 'all',     labelKey: 'all'     },
  { key: 'udhar',   labelKey: 'lena'    },  // balance > 0, we need to receive
  { key: 'advance', labelKey: 'advance' },  // balance < 0, they paid advance
  { key: 'settled', labelKey: 'settled' },  // balance === 0
];

export default function Parties() {
  const { t } = useLang();
  const { parties, loading } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [tab,    setTab]    = useState('all');

  const byTab = parties.filter((p) => {
    if (tab === 'udhar')   return p.balance > 0;
    if (tab === 'advance') return p.balance < 0;
    if (tab === 'settled') return p.balance === 0;
    return true;
  });

  const filtered = byTab.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const counts = {
    all:     parties.length,
    udhar:   parties.filter((p) => p.balance > 0).length,
    advance: parties.filter((p) => p.balance < 0).length,
    settled: parties.filter((p) => p.balance === 0).length,
  };

  if (loading) {
    return <div style={s.loading}>{t.loading}</div>;
  }

  return (
    <div className="page-enter">
      {/* ── Header ── */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.heading}>{t.parties}</h1>
          <p style={s.headingSub}>{parties.length} customers total</p>
        </div>
        <button style={s.addBtn} onClick={() => navigate('/add')}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> {t.addParty}
        </button>
      </div>

      {/* ── Tabs ── */}
      <div style={s.tabs}>
        {TABS.map(({ key, labelKey }) => (
          <button
            key={key}
            style={{
              ...s.tab,
              ...(tab === key ? s.tabActive : {}),
            }}
            onClick={() => setTab(key)}
          >
            {t[labelKey]}
            <span style={{
              ...s.tabCount,
              background: tab === key ? 'rgba(255,255,255,0.2)' : 'var(--surface-2)',
              color: tab === key ? '#fff' : 'var(--text-muted)',
            }}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search ── */}
      <div style={s.searchWrap}>
        <span style={s.searchIcon}>🔍</span>
        <input
          style={s.search}
          placeholder={t.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button style={s.clearBtn} onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* ── List ── */}
      <div style={s.list}>
        {filtered.length === 0 && (
          <div style={s.emptyState}>
            <div style={s.emptyIcon}>🔍</div>
            <p style={s.emptyText}>{t.noRecords}</p>
          </div>
        )}
        {filtered.map((p, idx) => {
          const isPos     = p.balance > 0;
          const isZero    = p.balance === 0;
          const chipBg    = isZero ? 'var(--border)' : (isPos ? 'var(--red)' : 'var(--green)');
          const chipColor = isZero ? 'var(--text-muted)' : (isPos ? 'var(--red-dark)' : 'var(--green-dark)');
          const chipLabel = isZero ? t.settled : (isPos ? t.lena : t.advance);

          return (
            <div
              key={p.id}
              style={{
                ...s.row,
                borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid var(--border)',
              }}
              onClick={() => navigate(`/parties/${p.id}`)}
            >
              <div style={s.rowLeft}>
                <div style={{
                  ...s.avatar,
                  background: isZero ? 'var(--border)' : (isPos ? 'var(--red)' : 'var(--green)'),
                  color: isZero ? 'var(--text-muted)' : (isPos ? 'var(--red-dark)' : 'var(--green-dark)'),
                }}>
                  {p.name[0].toUpperCase()}
                </div>
                <div>
                  <div style={s.name}>{p.name}</div>
                  <div style={s.phone}>{p.phone || '—'}</div>
                </div>
              </div>
              <div style={s.rowRight}>
                <div style={s.balanceBlock}>
                  <span style={{ ...s.chip, background: chipBg, color: chipColor }}>
                    {isZero ? '₹0' : fmt(p.balance)}
                  </span>
                  <span style={{ ...s.chipLabel, color: chipColor }}>{chipLabel}</span>
                </div>
                <span style={s.arrow}>›</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  loading: { padding: 40, color: 'var(--text-muted)', fontSize: 14 },

  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heading: { fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.4px', marginBottom: 4 },
  headingSub: { fontSize: 13, color: 'var(--text-muted)' },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'var(--sidebar)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius)',
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },

  tabs: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 14px',
    borderRadius: 20,
    border: '1.5px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text-muted)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  tabActive: {
    background: 'var(--sidebar)',
    color: '#fff',
    border: '1.5px solid var(--sidebar)',
  },
  tabCount: {
    fontSize: 11,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 10,
  },

  searchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchIcon: {
    position: 'absolute',
    left: 13,
    fontSize: 14,
    pointerEvents: 'none',
  },
  search: {
    width: '100%',
    padding: '10px 36px 10px 38px',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: 14,
    background: 'var(--surface)',
    color: 'var(--text)',
    outline: 'none',
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    fontSize: 14,
  },

  list: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--border)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    cursor: 'pointer',
    transition: 'background 0.1s',
  },
  rowLeft:  { display: 'flex', alignItems: 'center', gap: 12 },
  rowRight: { display: 'flex', alignItems: 'center', gap: 12 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    fontSize: 16,
    fontWeight: 700,
    flexShrink: 0,
  },
  name:  { fontSize: 14, fontWeight: 600, color: 'var(--text)' },
  phone: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  balanceBlock: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 },
  chip:      { fontSize: 13, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '-0.2px' },
  chipLabel: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' },
  arrow:     { fontSize: 20, color: 'var(--text-faint)', lineHeight: 1 },

  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 10, padding: '48px 24px',
  },
  emptyIcon: { fontSize: 36 },
  emptyText: { fontSize: 14, color: 'var(--text-muted)' },
};
