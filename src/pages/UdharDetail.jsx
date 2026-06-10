import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import useStore from '../store/useStore';

const fmt = (n) => `₹${Math.abs(n).toLocaleString('en-IN')}`;

export default function UdharDetail() {
  const { id } = useParams();
  const { t } = useLang();
  const { parties, entries } = useStore();
  const navigate = useNavigate();

  const party = parties.find((p) => p.id === id);
  const txns  = entries
    .filter((e) => e.party_id === id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!party) {
    return (
      <div style={s.center}>
        <p style={{ color: 'var(--text-muted)' }}>{t.noRecords}</p>
        <button style={s.backBtn} onClick={() => navigate('/parties')}>← {t.back}</button>
      </div>
    );
  }

  const isPos = party.balance >= 0;

  return (
    <div>
      {/* ── Header ── */}
      <button style={s.backLink} onClick={() => navigate('/parties')}>
        ← {t.back}
      </button>

      <div style={s.partyCard}>
        <div style={s.avatarLg}>{party.name[0].toUpperCase()}</div>
        <div style={s.partyInfo}>
          <div style={s.partyName}>{party.name}</div>
          <div style={s.partyPhone}>{party.phone}</div>
        </div>
        <div style={s.balanceBlock}>
          <span style={{
            ...s.balanceChip,
            background: isPos ? 'var(--green)' : 'var(--red)',
            color:      isPos ? 'var(--green-dark)' : 'var(--red-dark)',
          }}>
            {fmt(party.balance)}
          </span>
          <span style={s.balanceLabel}>{isPos ? t.lena : t.dena}</span>
        </div>
      </div>

      {/* ── Add entry button ── */}
      <div style={s.addRow}>
        <h2 style={s.sub}>{t.udhar} {t.balance}</h2>
        <button
          style={s.addBtn}
          onClick={() => navigate('/add', { state: { party_id: id } })}
        >
          + {t.addEntry}
        </button>
      </div>

      {/* ── Transactions ── */}
      <div style={s.list}>
        {txns.length === 0 && <p style={s.empty}>{t.noRecords}</p>}
        {txns.map((e) => {
          const isUdhar = e.type === 'udhar';
          return (
            <div key={e.id} style={s.row}>
              <div>
                <div style={s.txnType}>
                  {isUdhar ? t.udhar : t.payment}
                </div>
                <div style={s.txnMeta}>{e.date}{e.note ? ` · ${e.note}` : ''}</div>
              </div>
              <span style={{
                ...s.chip,
                background: isUdhar ? 'var(--red)' : 'var(--green)',
                color:      isUdhar ? 'var(--red-dark)' : 'var(--green-dark)',
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
  center:   { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 60 },
  backLink: {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    fontSize: 13, fontWeight: 500, padding: '0 0 16px', cursor: 'pointer',
  },
  backBtn: {
    background: 'var(--primary-light)', color: 'var(--primary-dark)',
    border: 'none', borderRadius: 'var(--radius)', padding: '8px 16px',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  partyCard: {
    display: 'flex', alignItems: 'center', gap: 14,
    background: 'var(--surface)', border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 20,
  },
  avatarLg: {
    width: 48, height: 48, borderRadius: '50%',
    background: 'var(--primary-light)', color: 'var(--primary-dark)',
    display: 'grid', placeItems: 'center',
    fontSize: 20, fontWeight: 700, flexShrink: 0,
  },
  partyInfo:  { flex: 1 },
  partyName:  { fontSize: 16, fontWeight: 700, color: 'var(--text)' },
  partyPhone: { fontSize: 13, color: 'var(--text-muted)', marginTop: 2 },
  balanceBlock: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 },
  balanceChip: { fontSize: 15, fontWeight: 700, padding: '4px 12px', borderRadius: 20 },
  balanceLabel: { fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 },
  addRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sub:    { fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' },
  addBtn: {
    background: 'var(--primary-dark)', color: '#fff',
    border: 'none', borderRadius: 'var(--radius)',
    padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  list: {
    background: 'var(--surface)', borderRadius: 'var(--radius)',
    border: '1.5px solid var(--border)', overflow: 'hidden',
  },
  row: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 16px', borderBottom: '1px solid var(--border)',
  },
  txnType: { fontSize: 14, fontWeight: 600, color: 'var(--text)' },
  txnMeta: { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  chip:    { fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 20 },
  empty:   { padding: '20px 16px', color: 'var(--text-muted)', fontSize: 14 },
};
