'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminUtils } from '@/lib/utils/AdminUtils';
import Modal from '@/components/core/Modal';

export default function AddOrgForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const name = formData.get('name');

    try {
      const res = await adminUtils('organizations', 'POST', { name });
      if (res.error) {
        setError(res.error);
        return;
      }
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError('Failed to establish new organization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="btn btn-primary d-flex align-items-center gap-2 px-4 shadow-lg"
      >
        <i className="bi bi-plus-square-fill"></i> Establish Organization
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Establish New Organization"
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger py-2 px-3 rounded-3 small mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-5">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Legal/Friendly Name</label>
            <input 
              type="text" name="name" 
              className="form-control bg-dark border-secondary text-white py-3 fs-5" 
              placeholder="e.g. Cyberdyne Systems" required 
              autoFocus
            />
            <div className="small opacity-50 mt-2">This name will be globally unique across the platform.</div>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light border-0 opacity-50 px-3 btn-cancel-hover" onClick={() => setIsOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-grow-1 py-3 fw-bold" disabled={loading}>
              {loading ? 'Establishing...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
