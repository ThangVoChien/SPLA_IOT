'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminUtils } from '@/lib/utils/AdminUtils';
import Modal from '@/components/core/Modal';


export default function AddUserForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const orgName = formData.get('orgName');

    try {
      const res = await adminUtils('users', 'POST', { 
        orgName,
        username,
        password
      });
      if (res.error) {
        setError(res.error);
        return;
      }
      setIsOpen(false);
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred.');
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
        <i className="bi bi-person-plus-fill"></i> Provision New User
      </button>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title="Provision Global Identity"
      >
        <form onSubmit={handleAdd}>
          {error && (
            <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger py-2 px-3 rounded-3 small mb-4">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Organization</label>
            <input 
              type="text" name="orgName" 
              className="form-control bg-dark border-secondary text-white py-2" 
              placeholder="e.g. Acme Corp" required 
            />
          </div>

          <div className="mb-4">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Login Username</label>
            <input 
              type="text" name="username" 
              className="form-control bg-dark border-secondary text-white py-2" 
              placeholder="account_id" required 
            />
          </div>

          <div className="mb-5">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Initial Secret (Password)</label>
            <input 
              type="password" name="password" 
              className="form-control bg-dark border-secondary text-white py-2" 
              placeholder="••••••••" required 
            />
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light border-0 opacity-50 px-3" onClick={() => setIsOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-grow-1 py-2 fw-bold" disabled={loading}>
              {loading ? 'Bootstrapping...' : 'Create Identity'}
            </button>
          </div>

        </form>
      </Modal>
    </>
  );
}



