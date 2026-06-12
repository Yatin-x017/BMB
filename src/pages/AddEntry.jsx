import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import useStore from '../store/useStore';

export default function AddEntry() {
  const { t }      = useLang();
  const navigate   = useNavigate();
  const location   = useLocation();
  const { parties, addEntry, addParty } = useStore();

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
    let partyId = form.party_id;

    if (newPartyMode) {
      if (!newParty.name.trim()) { setError('Customer name is required'); return; }
    } else {
      if (!partyId) { setError('Please select a customer'); return; }
    }

    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) {
      setError('Enter a valid amount greater than 0');
      return;
    }

    setLoading(true);

    if (newPartyMode) {
      const { data, error: pErr } = await addParty({
        name:  newParty.name,
        phone: newParty.phone,
      });
      if (pErr) { setError(pErr.message); setLoading(false); return; }
      partyId = data.id;
    }

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

  const selectedParty = parties.find((p) => p.id === form.party_id);

  return (
    <div className="page-enter">
      <button style={s.backLink} onClick={() => navigate(-1)}>← {t.back}</button>

      <div style={s.pageHeader}>
        <h1 style={s.heading}>{t.addEntry}</h1>
        <p style={s.headingSub}>Record a new transaction for your store</p>
      </div>

      <div style={s.layout}>
        {/* ── Main form ── */}
        <div style={s.card}>

          {/* ── Type toggle — most important, first ── */}
          <div style={s.section}>
            <label style={s.sectionLabel}>Transaction Type</label>
            <div style={s.typeGrid}>
              {['udhar', 'payment'].map((type) => {
                const isUdhar   = type === 'udhar';
                const isActive  = form.type === type;
                return (
                  <button
                    key={type}
                    style={{
                      ...s.typeCard,
                      border: `2px solid ${isActive
                        ? (isUdhar ? 'var(--red-dark)' : 'var(--green-dark)')
                        : 'var(--border)'}`,
                      background: isActive
                        ? (isUdhar ? 'var(--red)' : 'var(--green)')
                        : 'var(--surface-2)',
                    }}
                    onClick={() => set('type', type)}
                  >
                    <span style={{ fontSize: 24 }}>{isUdhar ? '📤' : '📥'}</span>
                    <span style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: isActive
                        ? (isUdhar ? 'var(--red-dark)' : 'var(--green-dark)')
                        : 'var(--text-muted)',
                    }}>
                      {isUdhar ? t.udhar : t.payment}
                    </span>
                    <span style={{
                      fontSize: 11,
                      color: 'var(--text-faint)',
                      fontWeight: 500,
                    }}>
                      {isUdhar ? 'Customer owes you' : 'Customer paid you'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Customer ── */}
          <div style={s.section}>
            <div style={s.fieldHeaderRow}>
              <label style={s.sectionLabel}>Customer</label>
              <button style={s.modeToggle} onClick={() => setNewPartyMode((v) => !v)}>
                {newPartyMode ? '← Select existing' : `+ ${t.addParty}`}
              </button>
            </div>

            {!newPartyMode ? (
              <select
                style={s.input}
                value={form.party_id}
                onChange={(e) => set('party_id', e.target.value)}
              >
                <option value="">— Select customer —</option>
                {parties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.phone ? ` (${p.phone})` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <div style={s.newPartyFields}>
                <input
                  style={s.input}
                  placeholder="Customer name *"
                  value={newParty.name}
                  onChange={(e) => setNewParty((n) => ({ ...n, name: e.target.value }))}
                />
                <input
                  style={s.input}
                  placeholder="Phone number (optional)"
                  value={newParty.phone}
                  onChange={(e) => setNewParty((n) => ({ ...n, phone: e.target.value }))}
                />
              </div>
            )}
          </div>

          {/* ── Amount ── */}
          <div style={s.section}>
            <label style={s.sectionLabel}>{t.amount}</label>
            <div style={s.amountWrap}>
              <span style={s.currencyPrefix}>₹</span>
              <input
                style={{ ...s.input, ...s.amountInput }}
                type="number"
                placeholder="0"
                min="1"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
              />
            </div>
          </div>

          {/* ── Date + Note row ── */}
          <div style={s.twoCol}>
            <div style={s.section}>
              <label style={s.sectionLabel}>{t.date}</label>
              <input
                style={s.input}
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
              />
            </div>
            <div style={s.section}>
              <label style={s.sectionLabel}>{t.note}</label>
              <input
                style={s.input}
                placeholder="e.g. Cement bags, October rent…"
                value={form.note}
                onChange={(e) => set('note', e.target.value)}
              />
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div style={s.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          {/* ── Actions ── */}
          <div style={s.actions}>
            <button style={s.cancelBtn} onClick={() => navigate(-1)} disabled={loading}>
              {t.cancel}
            </button>
            <button
              style={{ ...s.saveBtn, opacity: loading ? 0.75 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Saving…' : t.save}
            </button>
          </div>
        </div>

        {/* ── Summary preview ── */}
        <div style={s.preview}>
          <div style={s.previewTitle}>Preview</div>
          <div style={s.previewCard}>
            <div style={s.previewRow}>
              <span style={s.previewKey}>Customer</span>
              <span style={s.previewVal}>
                {newPartyMode
                  ? (newParty.name || '—')
                  : (selectedParty?.name || '—')}
              </span>
            </div>
            <div style={s.previewRow}>
              <span style={s.previewKey}>Type</span>
              <span style={{
                ...s.previewChip,
                background: form.type === 'udhar' ? 'var(--red)' : 'var(--green)',
                color: form.type === 'udhar' ? 'var(--red-dark)' : 'var(--green-dark)',
              }}>
                {form.type === 'udhar' ? t.udhar : t.payment}
              </span>
            </div>
            <div style={s.previewRow}>
              <span style={s.previewKey}>Amount</span>
              <span style={{
                ...s.previewVal,
                fontWeight: 800,
                fontSize: 20,
                color: form.type === 'udhar' ? 'var(--red-dark)' : 'var(--green-dark)',
              }}>
                {form.amount ? `₹${Number(form.amount).toLocaleString('en-IN')}` : '₹—'}
              </span>
            </div>
            <div style={s.previewRow}>
              <span style={s.previewKey}>Date</span>
              <span style={s.previewVal}>{form.date || '—'}</span>
            </div>
            {form.note && (
              <div style={s.previewRow}>
                <span style={s.previewKey}>Note</span>
                <span style={{ ...s.previewVal, fontStyle: 'italic', color: 'var(--text-muted)' }}>{form.note}</span>
              </div>
            )}
          </div>

          {selectedParty && (
            <div style={s.currentBalance}>
              <span style={s.previewKey}>Current balance</span>
              <span style={{
                ...s.previewChip,
                marginTop: 4,
                background: selectedParty.balance > 0 ? 'var(--red)' : 'var(--green)',
                color: selectedParty.balance > 0 ? 'var(--red-dark)' : 'var(--green-dark)',
              }}>
                {selectedParty.balance === 0
                  ? 'Settled'
                  : `₹${Math.abs(selectedParty.balance).toLocaleString('en-IN')} ${selectedParty.balance > 0 ? t.lena : t.advance}`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const s = {
  backLink: {
    background: 'none', border: 'none', color: 'var(--text-muted)',
    fontSize: 13, fontWeight: 500, padding: '0 0 18px', cursor: 'pointer',
    display: 'block',
  },
  pageHeader: { marginBottom: 24 },
  heading: { fontSize: 26, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.4px', marginBottom: 4 },
  headingSub: { fontSize: 13, color: 'var(--text-muted)' },

  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: 20,
    alignItems: 'start',
  },

  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--border)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
  },

  section: { marginBottom: 20 },
  sectionLabel: {
    display: 'block',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 8,
  },
  fieldHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modeToggle: {
    background: 'none', border: 'none',
    color: 'var(--accent-dark)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
  },

  typeGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
  },
  typeCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '18px 12px',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: 'var(--surface-2)',
  },

  input: {
    display: 'block',
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    color: 'var(--text)',
    background: 'var(--surface-2)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  newPartyFields: { display: 'flex', flexDirection: 'column', gap: 8 },

  amountWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  currencyPrefix: {
    position: 'absolute',
    left: 13,
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  amountInput: { paddingLeft: 30, fontSize: 20, fontWeight: 700 },

  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 0,
  },

  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--red)',
    color: 'var(--red-dark)',
    fontSize: 13,
    fontWeight: 500,
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    marginBottom: 16,
  },

  actions: { display: 'flex', gap: 10, marginTop: 24 },
  cancelBtn: {
    flex: 1, padding: '12px',
    borderRadius: 'var(--radius)', border: '1.5px solid var(--border)',
    background: 'var(--surface-2)', color: 'var(--text-muted)',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  saveBtn: {
    flex: 2, padding: '12px',
    borderRadius: 'var(--radius)', border: 'none',
    background: 'var(--sidebar)', color: '#fff',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
    transition: 'opacity 0.15s',
  },

  /* Preview sidebar */
  preview: {
    width: 220,
    position: 'sticky',
    top: 24,
  },
  previewTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 10,
  },
  previewCard: {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px',
    boxShadow: 'var(--shadow-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    marginBottom: 12,
  },
  previewRow: { display: 'flex', flexDirection: 'column', gap: 4 },
  previewKey: { fontSize: 10, color: 'var(--text-faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' },
  previewVal: { fontSize: 14, color: 'var(--text)', fontWeight: 600 },
  previewChip: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 12,
    display: 'inline-block',
  },
  currentBalance: {
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
};
