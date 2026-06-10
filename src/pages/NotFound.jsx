import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export default function NotFound() {
  const { t } = useLang();
  const navigate = useNavigate();

  return (
    <div style={s.wrap}>
      <div style={s.code}>404</div>
      <div style={s.msg}>{t.noRecords}</div>
      <button style={s.btn} onClick={() => navigate('/')}>
        ← {t.dashboard}
      </button>
    </div>
  );
}

const s = {
  wrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: 12,
  },
  code: { fontSize: 72, fontWeight: 700, color: 'var(--primary-light)', lineHeight: 1 },
  msg:  { fontSize: 15, color: 'var(--text-muted)', fontWeight: 500 },
  btn: {
    marginTop: 8, padding: '10px 20px', borderRadius: 'var(--radius)',
    background: 'var(--primary-dark)', color: '#fff',
    border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
};
