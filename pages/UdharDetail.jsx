import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import useStore from '../store/useStore';
import { Skeleton } from '../components/Skeleton';

const fmt = (n) => `₹${Math.abs(n).toLocaleString('en-IN')}`;

const fmtDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function UdharDetail() {
  const { id } = useParams();
  const { t }  = useLang();
  const { parties, entries, loading, deleteEntry, deleteParty } = useStore();
  const navigate = useNavigate();

  const [deletingEntry, setDeletingEntry] = useState(null);
  const [deletingParty, setDeletingParty] = useState(false);
  const [loadingId, setLoadingId]         = useState(null);

  const party = parties.find((p) => p.id === id);
  const txns  = entries
    .filter((e) => e.party_id === id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!party && loading) {
    return (
      <div className="page-enter">
        <Skeleton width={80} height={13} style={{ marginBottom: 20 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 16 }}>
          <Skeleton width={54} height={54} radius="50%" />
          <div style={{ flex: 1 }}>
            <Skeleton width={140} height={18} style={{ marginBottom: 8 }} />
            <Skeleton width={100} height={13} />
          </div>
          <Skeleton width={110} height={56} radius="var(--radius)" />
        </div>
      </div>
    );
  }

  if (!party) {
    return (
      <div style={s.notFound}>
        <div style={s.notFoundIcon}>🤔</div>
        <p style={s.notFoundText}>{t.noRecords}</p>
        <button style={s.backBtn} onClick={() => navigate('/parties')}>← {t.back}</button>
      </div>
    );
  }

  const isPos  = party.balance > 0;
  const isZero = party.balance === 0;

  const handleDeleteEntry = async (entryId) => {
    setLoadingId(entryId);
    await deleteEntry(entryId);
    setLoadingId(null);
    setDeletingEntry(null);
  };

  const handleDeleteParty = async () => {
    setLoadingId('party');
    await deleteParty(id);
    setLoadingId(null);
    navigate('/parties');
  };

  // Compute running balance for each transaction (chronological order for calc)
  const chronological = [...txns].sort((a, b) => new Date(a.date) - new Date(b.date));
  const runningBals = {};
  let runBal = 0;
  chronological.forEach((e) => {
    runBal += e.type === 'udhar' ? e.amount : -e.amount;
    runningBals[e.id] = runBal;
  });

  return (
    <div className="page-enter">
      {/* ── Back ── */}
      <button style={s.backLink} onClick={() => navigate('/parties')}>
        ← {t.back}
      </button>

      {/* ── Party card ── */}
      <div style={s.partyCard}>
        <div style={{
          ...s.avatarLg,
          background: isZero ? 'var(--border)' : (isPos ? 'var(--red)' : 'var(--green)'),
          color: isZero ? 'var(--text-muted)' : (isPos ? 'var(--red-dark)' : 'var(--green-dark)'),
        }}>
          {party.name[0].toUpperCase()}
        </div>
        <div style={s.partyInfo}>
          <div style={s.partyName}>{party.name}</div>
          {party.phone && <div style={s.partyPhone}>📞 {party.phone}</div>}
          <div style={s.txnCount}>{txns.length} transaction{txns.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={s.balanceBlock}>
          <div style={{
            ...s.balanceBadge,
            background: isZero ? 'var(--surface-2)' : (isPos ? 'var(--red)' : 'var(--green)'),
            color: isZero ? 'var(--text-muted)' : (isPos ? 'var(--red-dark)' : 'var(--green-dark)'),
            borderColor: isZero ? 'var(--border)' : (isPos ? 'var(--red-mid)' : 'var(--green-mid)'),
          }}>
            <span style={s.balanceAmt}>{isZero ? '₹0' : fmt(party.balance)}</span>
            <span style={s.balanceLabel}>
              {isZero ? t.settled : (isPos ? t.lena : t.advance)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Action bar ── */}
      <div style={s.actionBar}>
        <button style={s.addEntryBtn} onClick={() => navigate('/add', { state: { party_id: id } })}>
          <span>+</span> {t.addEntry}
        </button>
        <button
          style={s.deletePartyBtn}
          onClick={() => setDeletingParty(true)}
        >
          🗑️ {t.deleteParty}
        </button>
      </div>

      {/* ── Transaction list ── */}
      <div style={s.listCard}>
        <div style={s.listHeader}>
          <span style={s.listTitle}>Transactions</span>
          <span style={s.listMeta}>{txns.length} records</span>
        </div>

        {txns.length === 0 && (
          <div style={s.emptyState}>
            <div style={{ fontSize: 32 }}>📝</div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8 }}>{t.noRecords}</p>
          </div>
        )}

        {txns.map((e, idx) => {
          const isUdhar  = e.type === 'udhar';
          const runBal   = runningBals[e.id];
          const runIsPos = runBal > 0;
          const isLast   = idx === txns.length - 1;

          return (
            <div key={e.id} style={{ ...s.row, borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
              {/* Left indicator */}
              <div style={{
                ...s.typeBar,
                background: isUdhar ? 'var(--red-dark)' : 'var(--green-dark)',
              }} />

              <div style={s.rowBody}>
                <div style={s.rowTop}>
                  <div>
                    <span style={{
                      ...s.typeChip,
                      background: isUdhar ? 'var(--red)' : 'var(--green)',
                      color: isUdhar ? 'var(--red-dark)' : 'var(--green-dark)',
                    }}>
                      {isUdhar ? t.udhar : t.payment}
                    </span>
                    <span style={s.dateText}>{fmtDate(e.date)}</span>
                    {e.note && <span style={s.noteText}>· {e.note}</span>}
                  </div>
                  <div style={s.rowAmts}>
                    <span style={{
                      ...s.amtText,
                      color: isUdhar ? 'var(--red-dark)' : 'var(--green-dark)',
                    }}>
                      {isUdhar ? '−' : '+'}{fmt(e.amount)}
                    </span>
                  </div>
                </div>
                <div style={s.rowBottom}>
                  <span style={s.runningLabel}>{t.runningBalance}:</span>
                  <span style={{
                    ...s.runningVal,
                    color: runBal === 0 ? 'var(--text-muted)' : (runIsPos ? 'var(--red-dark)' : 'var(--green-dark)'),
                  }}>
                    {runBal === 0 ? '₹0 (settled)' : `${fmt(runBal)} ${runIsPos ? t.lena : t.advance}`}
                  </span>

                  {/* Delete entry button */}
                  {deletingEntry === e.id ? (
                    <div style={s.confirmDelete}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.confirmDelete}</span>
                      <button
                        style={s.confirmYes}
                        onClick={() => handleDeleteEntry(e.id)}
                        disabled={loadingId === e.id}
                      >
                        {loadingId === e.id ? '…' : 'Yes, Delete'}
                      </button>
                      <button style={s.confirmNo} onClick={() => setDeletingEntry(null)}>
                        {t.cancel}
                      </button>
                    </div>
                  ) : (
                    <button
                      style={s.deleteEntryBtn}
                      onClick={() => setDeletingEntry(e.id)}
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Delete party modal ── */}
      {deletingParty && (
        <div style={s.modalOverlay} onClick={() => setDeletingParty(false)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={s.modalIcon}>⚠️</div>
            <h3 style={s.modalTitle}>{t.deleteParty}</h3>
            <p style={s.modalText}>
              Delete <strong>{party.name}</strong> and all {txns.length} transactions? This cannot be undone.
            </p>
            <div style={s.modalActions}>
              <button style={s.modalCancel} onClick={() => setDeletingParty(false)}>
                {t.cancel}
              </button>
              <button
                style={s.modalDelete}
                onClick={handleDeleteParty}
                disabled={loadingId === 'party'}
              >
                {loadingId === 'party' ? '…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  notFound: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 80 },
  notFoundIcon: { fontSize: 48 },
  notFoundText: { fontSize: 14, color: 'var(--text-muted)' },
  backBtn: {
    background: 'var(--sidebar)', color: '#fff',
    border: 'none', borderRadius: 'var(--radius)', padding: '8px 18px',
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },

  backLink: {
    background: 'none', border: 'none',
    color: 'var(--text-muted)', fontSize: 13, fontWeight: 500,
    padding: '0 0 20px', cursor: 'pointer',
    display: 'block',
  },

  partyCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    background: 'var(--surface)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px 24px',
    marginBottom: 16,
    boxShadow: 'var(--shadow-sm)',
    flexWrap: 'wrap',
  },
  avatarLg: {
    width: 54,
    height: 54,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    fontSize: 22,
    fontWeight: 700,
    flexShrink: 0,
  },
  partyInfo: { flex: 1, minWidth: 120 },
  partyName: { fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' },
  partyPhone: { fontSize: 13, color: 'var(--text-muted)', marginTop: 3 },
  txnCount:  { fontSize: 12, color: 'var(--text-faint)', marginTop: 3 },
  balanceBlock: { display: 'flex', alignItems: 'center' },
  balanceBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px 20px',
    borderRadius: 'var(--radius)',
    border: '2px solid',
    minWidth: 110,
  },
  balanceAmt:   { fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' },
  balanceLabel: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2, opacity: 0.8 },

  actionBar: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  addEntryBtn: {
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
  deletePartyBtn: {
    background: 'var(--surface)',
    color: 'var(--red-dark)',
    border: '1.5px solid var(--red-mid)',
    borderRadius: 'var(--radius)',
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },

  listCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1.5px solid var(--border)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    background: 'var(--surface-2)',
    borderBottom: '1px solid var(--border)',
  },
  listTitle: { fontSize: 13, fontWeight: 700, color: 'var(--text)' },
  listMeta:  { fontSize: 12, color: 'var(--text-muted)' },

  row: {
    display: 'flex',
    alignItems: 'stretch',
  },
  typeBar: {
    width: 4,
    flexShrink: 0,
  },
  rowBody: {
    flex: 1,
    padding: '14px 18px',
  },
  rowTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
    flexWrap: 'wrap',
  },
  typeChip: {
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 8px',
    borderRadius: 12,
    marginRight: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  dateText: { fontSize: 12, color: 'var(--text-muted)', marginRight: 6 },
  noteText: { fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic' },
  rowAmts:  { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  amtText:  { fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px' },

  rowBottom: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  runningLabel: { fontSize: 11, color: 'var(--text-faint)', fontWeight: 500 },
  runningVal:   { fontSize: 12, fontWeight: 600 },
  deleteEntryBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    opacity: 0.5,
    padding: '2px 6px',
    transition: 'opacity 0.15s',
  },
  confirmDelete: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  confirmYes: {
    background: 'var(--red-dark)', color: '#fff',
    border: 'none', borderRadius: 'var(--radius-sm)',
    padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
  },
  confirmNo: {
    background: 'var(--surface-2)', color: 'var(--text-muted)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
    padding: '4px 10px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
  },

  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 6, padding: '48px 24px',
  },

  /* Delete party modal */
  modalOverlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(15,23,42,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200, padding: 20,
  },
  modal: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px 28px',
    maxWidth: 380, width: '100%',
    boxShadow: 'var(--shadow-lg)',
    textAlign: 'center',
  },
  modalIcon:    { fontSize: 40, marginBottom: 12 },
  modalTitle:   { fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 10 },
  modalText:    { fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24 },
  modalActions: { display: 'flex', gap: 10 },
  modalCancel: {
    flex: 1, padding: '11px',
    border: '1.5px solid var(--border)', borderRadius: 'var(--radius)',
    background: 'var(--surface-2)', color: 'var(--text-muted)',
    fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  modalDelete: {
    flex: 1, padding: '11px',
    border: 'none', borderRadius: 'var(--radius)',
    background: 'var(--red-dark)', color: '#fff',
    fontSize: 14, fontWeight: 700, cursor: 'pointer',
  },
};
