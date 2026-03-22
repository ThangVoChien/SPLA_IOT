'use client'

import { useState } from 'react';

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to change password');
      } else {
        setSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-5 pb-4 border-bottom border-white border-opacity-10">
      <form onSubmit={handleSubmit} className="mt-4" >
        <h4 className="text-white mb-4 d-flex align-items-center gap-2">
          <i className="bi bi-shield-lock text-warning"></i> Security
        </h4>
        <p className="text-muted mb-4 lh-lg">
          Ensure your account is using a long, random password to stay secure.
        </p>

        {error && <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger py-2 px-3 rounded-3 small mb-4">{error}</div>}
        {success && <div className="alert alert-success border-0 bg-success bg-opacity-10 text-success py-2 px-3 rounded-3 small mb-4">{success}</div>}

        <div className="mb-3">
          <label className="text-muted small fw-bold text-uppercase d-block mb-2">Current Password</label>
          <input
            type="password"
            className="form-control bg-dark border-secondary text-white py-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">New Password</label>
            <input
              type="password"
              className="form-control bg-dark border-secondary text-white py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Confirm New Password</label>
            <input
              type="password"
              className="form-control bg-dark border-secondary text-white py-2"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row mb-4 justify-content-end">
          <button type="submit" className="col-md-4 btn btn-warning px-5 py-2 fw-bold shadow-lg" disabled={loading}>
            {loading ? 'Verifying...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
