'use client'
import { useState } from 'react';
import { authUtils } from '@/lib/utils/AuthUtils';

export default function RegisterPage() {
  const [org, setOrg] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await authUtils('REGISTER', { username, password, orgName: org });
      if (res.error) {
        setError(res.error);
        return;
      }
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Registration network failure.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 p-4" style={{ backgroundColor: '#282a36' }}>
      <div className="glass-panel p-5 animate-fade-in shadow-lg" style={{ maxWidth: '450px', width: '100%', backgroundColor: '#44475a' }}>
        <div className="text-center mb-5">
          <div className="bg-primary rounded-4 p-3 d-inline-block shadow-lg mb-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <h2 className="fw-bold tracking-tight text-white mb-2">Provision Tenant</h2>
          <p className="text-muted">Initialize your SPLA Organization instance</p>
        </div>

        {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger py-2 px-3 rounded-3 small mb-4">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-muted small text-uppercase">Organization Name</label>
            <input 
              className="form-control bg-black bg-opacity-20 border-white border-opacity-10 text-white py-3" 
              style={{ borderRadius: '12px' }}
              value={org} onChange={e=>setOrg(e.target.value)} required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold text-muted small text-uppercase">Admin Username</label>
            <input 
              className="form-control bg-black bg-opacity-20 border-white border-opacity-10 text-white py-3" 
              style={{ borderRadius: '12px' }}
              value={username} onChange={e=>setUsername(e.target.value)} required 
            />
          </div>
          <div className="mb-5">
            <label className="form-label fw-semibold text-muted small text-uppercase">Secret Key (Password)</label>
            <input 
              type="password" 
              className="form-control bg-black bg-opacity-20 border-white border-opacity-10 text-white py-3" 
              style={{ borderRadius: '12px' }}
              value={password} onChange={e=>setPassword(e.target.value)} required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-3 fs-5 mb-4 shadow-lg" disabled={loading}>
            {loading ? 'Bootstrapping...' : 'Initialize Tenant'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-muted small mb-0">
            Already have an instance? <a href="/login" className="text-primary fw-bold text-decoration-none hover-underline">Return to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
