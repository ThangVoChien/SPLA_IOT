'use client'

import React from 'react';

/**
 * Form component for Add/Edit operations
 */
export default function AddGroupForm({ activeModal, addLabel, formData, setFormData, isSubmitting, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-4">
        <label className="form-label small fw-bold text-uppercase opacity-50">Resource Name</label>
        <input
          type="text"
          className="form-control"
          required
          placeholder="e.g. Ward A, Field 1, Zone Alpha"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="mb-4">
        <label className="form-label small fw-bold text-uppercase opacity-50">Operational Description</label>
        <textarea
          className="form-control"
          rows="3"
          placeholder="Provide context for this cluster..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="d-flex gap-2 justify-content-end mt-4">
        <button type="button" onClick={onCancel} className="btn btn-outline-light border-0 opacity-50 btn-cancel-hover">Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary px-4 fw-bold">
          {isSubmitting ? 'Syncing...' : (activeModal === 'ADD' ? 'Create Domain Entity' : 'Update Entity')}
        </button>
      </div>
    </form>
  );
}
