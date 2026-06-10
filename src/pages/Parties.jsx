import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import useStore from '../store/useStore';

const fmt = (n) => `₹${Math.abs(n).toLocaleString('en-IN')}`;

export default function Parties() {
  const { t } = useLang();
  const { parties } = useStore();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = parties.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  return (
    <div>
      {/* ── Header ── */}
      <div style={s.header}>
        <h1 style={s.heading}>{t.parties}</h1>
        <button style={s.addBtn} onClick={() => navigate('/add')}>
          + {t.addParty}
        </button>
      </div>

      {/* ── Search ── */}
      <input
        style={s.search}
        placeholder={t.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ── List ── */}
      <div style={s.list}>
        {filtered.length === 0 && <p style={s.empty}>{t.noRecords}</p>}
        {filtered.map((p) => {
          const isPos = p.balance >= 0;
          return (
            <div
              key={p.id}
              style={s.row}
              onClick={() => navigate(`/parties/${p.id}`)}
            >
              <div style={s.rowLeft}>
                <div style={s.avatar}>{p.name[0].toUpperCase()}</div>
                <div>
                  <div style={s.name}>{p.name}</div>
                  <div style={s.phone}>{p.phone}</div>
                </div>
              </div>
              <div style={s.rowRight}>
                <span style={{
                  ...s.chip,
                  background: isPos ? 'var(--green)' : 'var(--red)',
                  color:      isPos ? 'var(--green-dark)' : 'var(--red-dark)',
                }}>
                  {fmt(p.balance)}
                </span>
                <span style={s.chipLabel}>
                  {isPos ? t.lena : t.dena}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  header:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading:  { fontSize: 22, fontWeight: 700, color: 'var(--text)' },
  addBtn: {
    background: 'var(--primary-dark)', color: '#fff',
    border: 'none', borderRadius: 'var(--radius)',
    padding: '9px 16px', fontSize: 13, fontWeight: 600,
  },
  search: {
    width: '100%', padding: '10px 14px', marginBottom: 14,
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
    fontSize: 14, background: 'var(--surface)', color: 'var(--text)',
    outline: 'none',
  },
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
  rowLeft:  { display: 'flex', alignItems: 'center', gap: 12 },
  rowRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 },
  avatar: {
    width: 38, height: 38, borderRadius: '50%',
    background: 'var(--primary-light)', color: 'var(--primary-dark)',
    display: 'grid', placeItems: 'center',
    fontSize: 15, fontWeight: 700, flexShrink: 0,
  },
  name:      { fontSize: 14, fontWeight: 600, color: 'var(--text)' },
  phone:     { fontSize: 12, color: 'var(--text-muted)', marginTop: 2 },
  chip: { fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 20 },
  chipLabel: { fontSize: 10, color: 'var(--text-muted)', fontWeight: 500 },
  empty:     { padding: '20px 16px', color: 'var(--text-muted)', fontSize: 14 },
};
