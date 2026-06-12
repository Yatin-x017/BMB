import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import useStore from '../store/useStore';

const fmt = (n) => `₹${Math.abs(n).toLocaleString('en-IN')}`;

const fmtDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

export default function Dashboard() {
  const { t } = useLang();
  const { parties, entries, loading } = useStore();
  const navigate = useNavigate();

  const totalLena    = parties.reduce((s, p) => p.balance > 0 ? s + p.balance : s, 0);
  const totalAdvance = parties.reduce((s, p) => p.balance < 0 ? s + Math.abs(p.balance) : s, 0);
  const netBalance   = totalLena - totalAdvance;

  const recent = [...entries]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  const getParty = (id) => parties.find((p) => p.id === id);

  if (loading) {
    return <div style={s.loading}>{t.loading}</div>;
  }

  return (
    <div className="page-enter">
      {/* ── Page header ── */}
      <div style={s.pageHeader}>
        <div>
          <h1 style={s.heading}>{t.dashboard}</h1>
          <p style={s.headingSub}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button style={s.addBtn} onClick={() => navigate('/add')}>
          <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> {t.addEntry}
        </button>
      </div>

      {/* ── Stat cards ── */}
      <div style={s.cards}>
        {/* Customers count */}
        <div style={s.card}>
          <div style={s.cardIcon}>👥</div>
          <div style={s.cardContent}>
            <span style={s.cardLabel}>{t.parties}</span>
            <span style={s.cardVal}>{parties.length}</span>
          </div>
        </div>

        {/* Total receivable (lena) */}
        <div style={{ ...s.card, borderTop: '3px solid var(--red-dark)' }}>
          <div style={{ ...s.cardIcon, background: 'var(--red)', color: 'var(--red-dark)' }}>↑</div>
          <div style={s.cardContent}>
            <span style={s.cardLabel}>{t.totalUdhar}</span>
            <span style={{ ...s.cardVal, color: 'var(--red-dark)' }}>{fmt(totalLena)}</span>
          </div>
        </div>

        {/* Total advance (dena) */}
        <div style={{ ...s.card, borderTop: '3px solid var(--green-dark)' }}>
          <div style={{ ...s.cardIcon, background: 'var(--green)', color: 'var(--green-dark)' }}>↓</div>
          <div style={s.cardContent}>
            <span style={s.cardLabel}>{t.totalAdvance}</span>
            <span style={{ ...s.cardVal, color: 'var(--green-dark)' }}>{fmt(totalAdvance)}</span>
          </div>
        </div>

        {/* Net balance */}
        <div style={{ ...s.card, borderTop: `3px solid ${netBalance >= 0 ? 'var(--red-dark)' : 'var(--green-dark)'}` }}>
          <div style={{ ...s.cardIcon, background: netBalance >= 0 ? 'var(--red)' : 'var(--green)', color: netBalance >= 0 ? 'var(--red-dark)' : 'var(--green-dark)' }}>≈</div>
          <div style={s.cardContent}>
            <span style={s.cardLabel}>Net {netBalance >= 0 ? t.lena : t.advance}</span>
            <span style={{ ...s.cardVal, color: netBalance >= 0 ? 'var(--red-dark)' : 'var(--green-dark)' }}>{fmt(netBalance)}</span>
          </div>
        </div>
      </div>

      {/* ── Recent activity ── */}
      <div style={s.section}>
        <div style={s.sectionHeader}>
          <h2 style={s.sectionTitle}>{t.recentActivity}</h2>
          <button style={s.viewAllBtn} onClick={() => navigate('/parties')}>
            View all →
          </button>
        </div>

        <div style={s.list}>
          {recent.length === 0 && (
            <div style={s.emptyState}>
              <div style={s.emptyIcon}>📒</div>
              <p style={s.emptyText}>{t.noRecords}</p>
              <button style={s.emptyAction} onClick={() => navigate('/add')}>
                + {t.addEntry}
              </button>
            </div>
          )}
          {recent.map((e, idx) => {
            const party   = getParty(e.party_id);
            const isUdhar = e.type === 'udhar';
            return (
              <div
                key={e.id}
                style={{ ...s.row, borderBottom: idx === recent.length - 1 ? 'none' : '1px solid var(--border)' }}
                onClick={() => navigate(`/parties/${e.party_id}`)}
              >
                <div style={s.rowLeft}>
                  <div style={{ ...s.avatar, background: isUdhar ? 'var(--red)' : 'var(--green)', color: isUdhar ? 'var(--red-dark)' : 'var(--green-dark)' }}>
                    {party?.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <div style={s.rowName}>{party?.name ?? '—'}</div>
                    <div style={s.rowMeta}>
                      {isUdhar ? t.udhar : t.payment}
                      {e.note ? ` · ${e.note}` : ''} · {fmtDate(e.date)}
                    </div>
                  </div>
                </div>
                <div style={s.rowRight}>
                  <span style={{
                    ...s.chip,
                    background: isUdhar ? 'var(--red)' : 'var(--green)',
                    color:      isUdhar ? 'var(--red-dark)' : 'var(--green-dark)',
                  }}>
                    {isUdhar ? '−' : '+'}{fmt(e.amount)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
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
    marginBottom: 28,
  },
  heading: {
    fontSize: 26,
    fontWeight: 800,
    color: 'var(--text)',
    letterSpacing: '-0.4px',
    marginBottom: 4,
  },
  headingSub: {
    fontSize: 13,
    color: 'var(--text-muted)',
    fontWeight: 400,
  },
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

  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 14,
    marginBottom: 32,
  },
  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--border)',
    borderTop: '3px solid var(--accent)',
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    boxShadow: 'var(--shadow-sm)',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-light)',
    color: 'var(--accent-dark)',
    display: 'grid',
    placeItems: 'center',
    fontSize: 18,
    fontWeight: 700,
    flexShrink: 0,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minWidth: 0,
  },
  cardLabel: { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' },
  cardVal:   { fontSize: 22, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' },

  section: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--border)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid var(--border)',
    background: 'var(--surface-2)',
  },
  sectionTitle: { fontSize: 14, fontWeight: 700, color: 'var(--text)' },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-dark)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },

  list: { overflow: 'hidden' },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    cursor: 'pointer',
    transition: 'background 0.1s',
  },
  rowLeft:  { display: 'flex', alignItems: 'center', gap: 12 },
  rowRight: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  rowName:  { fontSize: 14, fontWeight: 600, color: 'var(--text)' },
  rowMeta:  { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  chip: {
    fontSize: 13,
    fontWeight: 700,
    padding: '4px 12px',
    borderRadius: 20,
    letterSpacing: '-0.2px',
  },

  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    padding: '48px 24px',
  },
  emptyIcon: { fontSize: 36 },
  emptyText: { fontSize: 14, color: 'var(--text-muted)' },
  emptyAction: {
    background: 'var(--sidebar)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    padding: '8px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
  },
};
