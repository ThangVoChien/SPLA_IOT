'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminUtils } from '@/lib/utils/AdminUtils';
import Modal from '@/components/core/Modal';
import ConfirmDialog from '@/components/core/ConfirmDialog';

export default function UserActionButtons({ user, currentUserId }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isSelf = user.id === currentUserId;


  // Confirmation States
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'promote' | 'downgrade'

  // Edit states
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState('');

  const executeRoleChange = async () => {
    setLoading(true);
    setPendingAction(null);
    try {
      const role = pendingAction === 'promote' ? 'ADMIN' : 'USER';
      const res = await adminClient('users', 'PATCH', { role }, user.id);
      if (res.error) {
        setError(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError('Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminClient('users', 'PUT', { username, password }, user.id);
      if (res.error) {
        setError(res.error);
      } else {
        setIsEditing(false);
        router.refresh();
      }
    } catch (err) {
      setError('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    setConfirmDelete(false);
    setLoading(true);
    setError('');
    try {
      const res = await adminUtils('users', 'DELETE', {}, user.id);
      if (res.error) {
        setError(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex gap-2 justify-content-end align-items-center">


      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger py-1 px-3 rounded-pill small m-0 me-2 animate-fade-in">
          {error}
          <button onClick={() => setError('')} className="btn btn-sm btn-link text-danger text-decoration-none py-0">×</button>
        </div>
      )}

      {user.role === 'USER' && (
        <button
          className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 px-3 py-2"
          onClick={() => setPendingAction('promote')}
          disabled={loading}
        >
          <i className="bi bi-arrow-up-circle"></i> Promote
        </button>
      )}
      {user.role === 'ADMIN' && !isSelf && (
        <button
          className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 px-3 py-2"
          onClick={() => setPendingAction('downgrade')}
          disabled={loading}
        >
          <i className="bi bi-arrow-down-circle"></i> Downgrade
        </button>
      )}

      <button
        className="btn btn-sm btn-outline-info d-flex align-items-center gap-1 px-3 py-2"
        onClick={() => setIsEditing(true)}
        disabled={loading}
      >
        <i className="bi bi-pencil-square"></i> Edit
      </button>

      {!isSelf && (
        <button
          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-3 py-2"
          onClick={() => setConfirmDelete(true)}
          disabled={loading}
        >
          <i className="bi bi-trash-fill"></i> Delete
        </button>
      )}


      {/* Reusable Modal for User Editing */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={`Edit Identity Control: ${user.username}`}
      >
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Username</label>
            <input
              className="form-control bg-dark border-secondary text-white py-2"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Reset Password</label>
            <input
              type="password"
              className="form-control bg-dark border-secondary text-white py-2"
              placeholder="Leave blank to keep"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light border-0 opacity-50 px-3" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-grow-1 py-2 fw-bold" disabled={loading}>
              {loading ? 'Propagating Changes...' : 'Save Updates'}
            </button>
          </div>

        </form>
      </Modal>

      {/* Styled Confirmation for Role Changes */}
      <ConfirmDialog
        isOpen={!!pendingAction}
        onClose={() => setPendingAction(null)}
        onConfirm={executeRoleChange}
        variant={pendingAction === 'promote' ? 'success' : 'warning'}
        title="Escalation Request"
        message={`Are you sure you want to ${pendingAction === 'promote' ? 'UPGRADE' : 'DOWNGRADE'} the authority level of user "${user.username}"?`}
        confirmText={pendingAction === 'promote' ? 'Promote User' : 'Downgrade User'}
      />

      {/* Styled Confirmation for Deletion */}
      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={executeDelete}
        variant="danger"
        title="⚠️ PERSISTENT DATA LOSS"
        message={`Are you sure you want to PERMANENTLY DELETE user "${user.username}"?\n\nThis action will purge all associated identity data from the global registry. This action is irreversible.`}
        confirmText="Delete Permanently"
      />
    </div>
  );
}



