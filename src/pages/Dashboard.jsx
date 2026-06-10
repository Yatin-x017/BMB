import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import useStore from '../store/useStore';

const fmt = (n) => `₹${Math.abs(n).toLocaleString('en-IN')}`;

export default function Dashboard() {
  const { t } = useLang();
  const { parties, entries } = useStore();
  const navigate = useNavigate();

  const totalLena = parties.reduce((sum, p) => p.balance > 0 ? sum + p.balance : sum, 0);
  const totalDena = parties.reduce((sum, p) => p.balance < 0 ? sum + Math.abs(p.balance) : sum, 0);

  const recent = [...entries]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const getParty = (id) => parties.find((p) => p.id === id);

  return (
    <div>
      <h1 style={s.heading}>{t.dashboard}</h1>

      {/* ── Stat cards ── */}
      <div style={s.cards}>
        <div style={s.card}>
          <span style={s.cardLabel}>{t.parties}</span>
          <span style={s.cardVal}>{parties.length}</span>
        </div>
        <div style={{ ...s.card, background: 'var(--green)' }}>
          <span style={s.cardLabel}>{t.lena}</span>
          <span style={{ ...s.cardVal, color: 'var(--green-dark)' }}>{fmt(totalLena)}</span>
        </div>
        <div style={{ ...s.card, background: 'var(--red)' }}>
          <span style={s.cardLabel}>{t.dena}</span>
          <span style={{ ...s.cardVal, color: 'var(--red-dark)' }}>{fmt(totalDena)}</span>
        </div>
      </div>

      {/* ── Recent activity ── */}
      <h2 style={s.sub}>{t.recentActivity}</h2>
      <div style={s.list}>
        {recent.length === 0 && <p style={s.empty}>{t.noRecords}</p>}
        {recent.map((e) => {
          const party = getParty(e.party_id);
          const isUdhar = e.type === 'udhar';
          return (
            <div
              key={e.id}
              style={s.row}
              onClick={() => navigate(`/parties/${e.party_id}`)}
            >
              <div style={s.rowLeft}>
                <div style={s.rowAvatar}>{party?.name?.[0] ?? '?'}</div>
                <div>
                  <div style={s.rowName}>{party?.name ?? '—'}</div>
                  <div style={s.rowMeta}>{e.note || e.date}</div>
                </div>
              </div>
              <span style={{
                ...s.chip,
                background: isUdhar ? 'var(--red)' : 'var(--green)',
                color: isUdhar ? 'var(--red-dark)' : 'var(--green-dark)',
              }}>
                {isUdhar ? '−' : '+'}{fmt(e.amount)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  heading: { fontSize: 22, fontWeight: 700, marginBottom: 20, color: 'var(--text)' },
  cards:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 },
  card: {
    background: 'var(--primary-light)',
    borderRadius: 'var(--radius)',
    padding: '18px 20px',
    display: 'flex', flexDirection: 'column', gap: 6,
  },
  cardLabel: { fontSize: 12, fontWeight: 500, color: 'var(--text-muted)' },
  cardVal:   { fontSize: 26, fontWeight: 700, color: 'var(--primary-dark)' },
  sub:  { fontSize: 14, fontWeight: 600, color: 'var(--text-muted)', margin: '28px 0 10px' },
  list: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--border)',
    overflow: 'hidden',
  },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 16px', borderBottom: '1px solid var(--border)',
    cursor: 'pointer',
  },
  rowLeft:   { display: 'flex', alignItems: 'center', gap: 12 },
  rowAvatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'var(--primary-light)', color: 'var(--primary-dark)',
    display: 'grid', placeItems: 'center',
    fontSize: 14, fontWeight: 700, flexShrink: 0,
  },
  rowName:   { fontSize: 14, fontWeight: 600, color: 'var(--text)' },
  rowMeta:   { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  chip: { fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 20 },
  empty: { padding: '20px 16px', color: 'var(--text-muted)', fontSize: 14 },
};
