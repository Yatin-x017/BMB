import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import useStore from '../store/useStore';

export default function AddEntry() {
  const { t }      = useLang();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { parties, addEntry, addParty } = useStore();

  // Pre-select party if navigated from UdharDetail
  const preSelected = location.state?.party_id ?? '';

  const [form, setForm] = useState({
    party_id: preSelected,
    amount:   '',
    type:     'udhar',
    date:     new Date().toISOString().split('T')[0],
    note:     '',
  });

  const [newPartyMode, setNewPartyMode] = useState(false);
  const [newParty,     setNewParty]     = useState({ name: '', phone: '' });
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    setError('');

    // ── Validation ──────────────────────────────────────────────────────
    let partyId = form.party_id;

    if (newPartyMode) {
      if (!newParty.name.trim()) { setError('Name is required'); return; }
    } else {
      if (!partyId) { setError('Select a party'); return; }
    }

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }

    setLoading(true);

    // ── Create new party first if needed ──────────────────────────────
    if (newPartyMode) {
      const { data, error: pErr } = await addParty({
        name:  newParty.name,
        phone: newParty.phone,
      });
      if (pErr) { setError(pErr.message); setLoading(false); return; }
      partyId = data.id;
    }

    // ── Add entry ────────────────────────────────────────────────────
    const { error: eErr } = await addEntry({
      party_id: partyId,
      amount:   Number(form.amount),
      type:     form.type,
      date:     form.date,
      note:     form.note.trim(),
    });

    setLoading(false);
    if (eErr) { setError(eErr.message); return; }

    navigate(`/parties/${partyId}`);
  };

  return (
    <div>
      <button style={s.backLink} onClick={() => navigate(-1)}>← {t.back}</button>
      <h1 style={s.heading}>{t.addEntry}</h1>

      <div style={s.card}>

        {/* ── Party select ── */}
        <label style={s.label}>{t.name}</label>
        {!newPartyMode ? (
          <>
            <select
              style={s.input}
              value={form.party_id}
              onChange={(e) => set('party_id', e.target.value)}
            >
              <option value="">{t.search}</option>
              {parties.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button style={s.toggleBtn} onClick={() => setNewPartyMode(true)}>
              + {t.addParty}
            </button>
          </>
        ) : (
          <>
            <input
              style={s.input}
              placeholder={t.name}
              value={newParty.name}
              onChange={(e) => setNewParty((n) => ({ ...n, name: e.target.value }))}
            />
            <input
              style={{ ...s.input, marginTop: 8 }}
              placeholder={t.phone}
              value={newParty.phone}
              onChange={(e) => setNewParty((n) => ({ ...n, phone: e.target.value }))}
            />
            <button style={s.toggleBtn} onClick={() => setNewPartyMode(false)}>
              ← {t.back}
            </button>
          </>
        )}

        {/* ── Type toggle ── */}
        <label style={{ ...s.label, marginTop: 16 }}>{t.udhar} / {t.payment}</label>
        <div style={s.typeRow}>
          {['udhar', 'payment'].map((type) => (
            <button
              key={type}
              style={{
                ...s.typeBtn,
                background: form.type === type
                  ? (type === 'udhar' ? 'var(--red)' : 'var(--green)')
                  : 'var(--bg)',
                color: form.type === type
                  ? (type === 'udhar' ? 'var(--red-dark)' : 'var(--green-dark)')
                  : 'var(--text-muted)',
                border: `1.5px solid ${form.type === type
                  ? (type === 'udhar' ? 'var(--red-dark)' : 'var(--green-dark)')
                  : 'var(--border)'}`,
              }}
              onClick={() => set('type', type)}
            >
              {type === 'udhar' ? t.udhar : t.payment}
            </button>
          ))}
        </div>

        {/* ── Amount ── */}
        <label style={{ ...s.label, marginTop: 16 }}>{t.amount}</label>
        <input
          style={s.input}
          type="number"
          placeholder="0"
          value={form.amount}
          onChange={(e) => set('amount', e.target.value)}
        />

        {/* ── Date ── */}
        <label style={{ ...s.label, marginTop: 16 }}>{t.date}</label>
        <input
          style={s.input}
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
        />

        {/* ── Note ── */}
        <label style={{ ...s.label, marginTop: 16 }}>{t.note}</label>
        <input
          style={s.input}
          placeholder={t.note}
          value={form.note}
          onChange={(e) => set('note', e.target.value)}
        />

        {/* ── Error ── */}
        {error && <p style={s.error}>{error}</p>}

        {/* ── Actions ── */}
        <div style={s.actions}>
          <button style={s.cancelBtn} onClick={() => navigate(-1)} disabled={loading}>
            {t.cancel}
          </button>
          <button
            style={{ ...s.saveBtn, opacity: loading ? 0.7 : 1 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? '...' : t.save}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  backLink: {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    fontSize: 13, fontWeight: 500, padding: '0 0 16px', cursor: 'pointer',
  },
  heading: { fontSize: 22, fontWeight: 700, marginBottom: 20, color: 'var(--text)' },
  card: {
    background: 'var(--surface)', borderRadius: 'var(--radius)',
    border: '1.5px solid var(--border)', padding: '20px',
    maxWidth: 480,
  },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 },
  input: {
    width: '100%', padding: '10px 12px',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
    fontSize: 14, color: 'var(--text)', background: 'var(--bg)', outline: 'none',
    boxSizing: 'border-box',
  },
  toggleBtn: {
    background: 'none', border: 'none', color: 'var(--primary-dark)',
    fontSize: 12, fontWeight: 600, padding: '6px 0', cursor: 'pointer',
  },
  typeRow: { display: 'flex', gap: 10 },
  typeBtn: {
    flex: 1, padding: '10px', borderRadius: 'var(--radius)',
    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
  },
  error: { color: 'var(--red-dark)', fontSize: 12, marginTop: 12 },
  actions: { display: 'flex', gap: 10, marginTop: 20 },
  cancelBtn: {
    flex: 1, padding: '11px', borderRadius: 'var(--radius)',
    border: '1.5px solid var(--border)', background: 'var(--bg)',
    color: 'var(--text-muted)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  saveBtn: {
    flex: 1, padding: '11px', borderRadius: 'var(--radius)',
    border: 'none', background: 'var(--primary-dark)',
    color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
};
