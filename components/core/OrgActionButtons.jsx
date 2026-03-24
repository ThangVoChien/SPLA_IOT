'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminUtils } from '@/lib/utils/AdminUtils';
import Modal from '@/components/core/Modal';
import ConfirmDialog from '@/components/core/ConfirmDialog';

export default function OrgActionButtons({ org, currentOrgId }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isCurrentOrg = org.id === currentOrgId;

  // Edit states
  const [name, setName] = useState(org.name);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminUtils('organizations', 'PUT', { name }, org.id);
      if (res.error) {
        setError(res.error);
      } else {
        setIsEditing(false);
        router.refresh();
      }
    } catch (err) {
      setError('Failed to update organization');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    setConfirmDelete(false);
    setLoading(true);
    setError('');
    try {
      const res = await adminUtils('organizations', 'DELETE', {}, org.id);
      if (res.error) {
        setError(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError('Failed to purge organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex gap-2 justify-content-end align-items-center">

      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger py-1 px-3 rounded-pill small m-0 me-2 animate-fade-in">
          {error}
          <button onClick={() => setError('')} className="btn btn-sm btn-link text-danger text-decoration-none py-0 btn-sm-cancel">×</button>
        </div>
      )}

      <button
        className="btn btn-sm btn-outline-info d-flex align-items-center gap-1 px-3 py-2"
        onClick={() => setIsEditing(true)}
        disabled={loading}
      >
        <i className="bi bi-pencil-square"></i> Edit
      </button>

      {!isCurrentOrg && (
        <button
          className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-3 py-2"
          onClick={() => setConfirmDelete(true)}
          disabled={loading}
        >
          <i className="bi bi-trash-fill"></i> Delete
        </button>
      )}

      {/* Rename Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={`Edit Organization: ${org.name}`}
      >
        <form onSubmit={handleUpdate}>
          <div className="mb-5">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Namespace Update</label>
            <input
              className="form-control bg-dark border-secondary text-white py-3 fs-5"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light border-0 opacity-50 px-3 btn-cancel-hover" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-grow-1 py-3 fw-bold" disabled={loading}>
              {loading ? 'Propagating...' : 'Update Name'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Purge Confirmation */}
      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={executeDelete}
        variant="danger"
        title="⚠️ IRREVERSIBLE ACTION"
        message={`Are you sure you want to PERMANENTLY PURGE organization "${org.name}"?\n\nThis will instantly terminate all users, devices, and telemetry records associated with this entity. This action cannot be undone.`}
        confirmText="Purge Everything"
      />
    </div>
  );
}
