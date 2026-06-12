import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 64 }}>🔍</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>Page not found</h1>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 300 }}>This page doesn't exist in your khata book.</p>
      <button
        style={{ background: 'var(--sidebar)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}
        onClick={() => navigate('/')}
      >
        ← Go to Dashboard
      </button>
    </div>
  );
}
