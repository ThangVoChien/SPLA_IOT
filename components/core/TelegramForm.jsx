'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileForm({ initialChatId, initialEnabled }) {
  const [telegramChatId, setTelegramChatId] = useState(initialChatId);
  const [telegramEnabled, setTelegramEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramChatId, telegramEnabled })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to update profile');
      } else {
        setSuccess('Profile updated successfully!');
        router.refresh();
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h4 className="text-white mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-telegram text-info"></i> Telegram Integrations
      </h4>
      <p className="text-muted mb-4 lh-lg">
        Link your Telegram account to receive real-time alerts when your devices exceed
        their configured thresholds. To get your Chat ID, message <strong>@userinfobot</strong> on Telegram.
      </p>
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger py-2 px-3 rounded-3 small mb-4">{error}</div>}
        {success && <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success py-2 px-3 rounded-3 small mb-4">{success}</div>}

        <div className="mb-4">
          <label className="text-info small fw-bold text-uppercase d-block mb-3">Telegram Chat ID</label>
          <div className="input-group mb-3">
            <span className="input-group-text bg-black border-secondary text-info border-end-0">
              <i className="bi bi-chat-dots-fill"></i>
            </span>
            <input
              type="text"
              className="form-control bg-dark border-secondary text-white py-3 border-start-0 ps-0"
              placeholder="e.g. 123456789"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
            />
          </div>

          <div className="form-check form-switch mt-3 d-flex align-items-center gap-2">
            <input
              className="form-check-input mt-0"
              type="checkbox"
              id="telegramEnabled"
              checked={telegramEnabled}
              onChange={(e) => setTelegramEnabled(e.target.checked)}
              style={{ width: '2.5rem', height: '1.25rem', cursor: 'pointer' }}
            />
            <label className="form-check-label text-white fw-medium cursor-pointer" htmlFor="telegramEnabled" style={{ cursor: 'pointer' }}>
              Receive Real-Time Alerts
            </label>
          </div>
          <div className="form-text mt-2 opacity-50">Toggle to temporarily pause notifications without clearing your Chat ID.</div>
        </div>

        <div className="row mb-4 justify-content-end">
          <button type="submit" className="col-md-4 btn btn-primary px-5 py-2 fw-bold shadow-lg" disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>

      </form>
    </div>
  );
}
