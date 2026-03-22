'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminUtils } from '@/lib/utils/AdminUtils';
import Modal from '@/components/core/Modal';
import ConfirmDialog from '@/components/core/ConfirmDialog';

export default function SensorActionButtons({ sensor }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Edit states
  const [sensorType, setSensorType] = useState(sensor.sensorType);
  const [unit, setUnit] = useState(sensor.unit);
  const [dataType, setDataType] = useState(sensor.dataType);
  const [alertTemplate, setAlertTemplate] = useState(sensor.alertTemplate || '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminClient('sensors', 'PUT', { sensorType, unit, dataType, alertTemplate }, sensor.id);
      if (res.error) {
        setError(res.error);
      } else {
        setIsEditing(false);
        router.refresh();
      }
    } catch (err) {
      setError('Failed to update sensor');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    setConfirmDelete(false);
    setLoading(true);
    setError('');
    try {
      const res = await adminUtils('sensors', 'DELETE', {}, sensor.id);
      if (res.error) {
        setError(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError('Failed to delete sensor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex gap-2 justify-content-end align-items-center">
      {error && (
        <div className="alert alert-danger border-0 bg-danger bg-opacity-10 text-danger py-1 px-3 rounded-pill small m-0 me-2 animate-fade-in">
          {error}
          <button onClick={() => setError('')} className="btn btn-sm btn-link text-danger text-decoration-none py-0 btn-sm-cancel">&times;</button>
        </div>
      )}

      <button
        className="btn btn-sm btn-outline-info d-flex align-items-center gap-1 px-3 py-2"
        onClick={() => setIsEditing(true)}
        disabled={loading}
      >
        <i className="bi bi-pencil-square"></i> Edit
      </button>

      <button
        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-3 py-2"
        onClick={() => setConfirmDelete(true)}
        disabled={loading}
      >
        <i className="bi bi-trash-fill"></i> Delete
      </button>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={`Edit Sensor: ${sensor.sensorType}`}
      >
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Sensor Type</label>
            <input
              className="form-control bg-dark border-secondary text-white py-2"
              value={sensorType}
              onChange={e => setSensorType(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="row mb-3">
            <div className="col-6">
              <label className="text-muted small fw-bold text-uppercase d-block mb-2">Unit</label>
              <input
                className="form-control bg-dark border-secondary text-white py-2"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label className="text-muted small fw-bold text-uppercase d-block mb-2">Data Type</label>
              <select
                className="form-select bg-dark border-secondary text-white py-2"
                value={dataType}
                onChange={e => setDataType(e.target.value)}
                required
              >
                <option value="FLOAT">Float</option>
                <option value="INTEGER">Integer</option>
                <option value="BOOLEAN">Boolean</option>
                <option value="STRING">String</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Alert Template</label>
            <textarea
              className="form-control bg-dark border-secondary text-white py-2"
              rows="2"
              value={alertTemplate}
              onChange={e => setAlertTemplate(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light border-0 opacity-50 px-3 btn-cancel-hover" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-grow-1 py-2 fw-bold" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={executeDelete}
        variant="danger"
        title="⚠️ IRREVERSIBLE ACTION"
        message={`Are you sure you want to PERMANENTLY DELETE sensor "${sensor.sensorType}" (${sensor.unit})?\n\nAll linked devices will lose their sensor reference. This action cannot be undone.`}
        confirmText="Delete Sensor"
      />
    </div>
  );
}
