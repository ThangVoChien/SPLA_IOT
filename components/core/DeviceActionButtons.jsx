'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deviceUtils } from '@/lib/utils/DeviceUtils';
import Modal from '@/components/core/Modal';
import ConfirmDialog from '@/components/core/ConfirmDialog';

export default function DeviceActionButtons({ device, sensors }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSettingThreshold, setIsSettingThreshold] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Edit states
  const [name, setName] = useState(device.name);
  const [macAddress, setMacAddress] = useState(device.macAddress);
  const [sensorId, setSensorId] = useState(device.sensorId);

  // Threshold states
  const [operator, setOperator] = useState(device.threshold?.operator || '>');
  const [thresholdValue, setThresholdValue] = useState(device.threshold?.thresholdValue || '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await deviceUtils('PUT', { name, macAddress, sensorId }, device.id);
      if (res.error) {
        setError(res.error);
      } else {
        setIsEditing(false);
        router.refresh();
      }
    } catch (err) {
      setError('Failed to update device');
    } finally {
      setLoading(false);
    }
  };

  const executeDelete = async () => {
    setConfirmDelete(false);
    setLoading(true);
    setError('');
    try {
      const res = await deviceUtils('DELETE', {}, device.id);
      if (res.error) {
        setError(res.error);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError('Failed to delete device');
    } finally {
      setLoading(false);
    }
  };

  const handleSetThreshold = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await deviceUtils('PUT', { operator, thresholdValue }, device.id, 'threshold');
      if (res.error) {
        setError(res.error);
      } else {
        setIsSettingThreshold(false);
        router.refresh();
      }
    } catch (err) {
      setError('Failed to set threshold');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteThreshold = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await deviceUtils('DELETE', {}, device.id, 'threshold');
      if (res.error) {
        setError(res.error);
      } else {
        setOperator('>');
        setThresholdValue('');
        router.refresh();
      }
    } catch (err) {
      setError('Failed to remove threshold');
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
        className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1 px-3 py-2"
        onClick={() => setIsSettingThreshold(true)}
        disabled={loading}
      >
        <i className="bi bi-speedometer2"></i> Threshold
      </button>

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

      {/* Edit Device Modal */}
      <Modal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={`Edit Device: ${device.name}`}
      >
        <form onSubmit={handleUpdate}>
          <div className="mb-3">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Device Name</label>
            <input
              className="form-control bg-dark border-secondary text-white py-2"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-3">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">MAC Address</label>
            <input
              className="form-control bg-dark border-secondary text-white py-2"
              value={macAddress}
              onChange={e => setMacAddress(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Sensor Type</label>
            <select
              className="form-select bg-dark border-secondary text-white py-2"
              value={sensorId}
              onChange={e => setSensorId(e.target.value)}
              required
            >
              {sensors.map(s => (
                <option key={s.id} value={s.id}>{s.sensorType} ({s.unit})</option>
              ))}
            </select>
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light border-0 opacity-50 px-3 btn-cancel-hover" onClick={() => setIsEditing(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-grow-1 py-2 fw-bold" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Threshold Modal */}
      <Modal
        isOpen={isSettingThreshold}
        onClose={() => setIsSettingThreshold(false)}
        title={`Threshold: ${device.name}`}
      >
        <form onSubmit={handleSetThreshold}>
          <p className="text-muted small mb-3">
            Configure when an alert should trigger for this device. The alert fires when the sensor value matches the condition below.
          </p>
          <div className="row mb-3">
            <div className="col-5">
              <label className="text-muted small fw-bold text-uppercase d-block mb-2">Operator</label>
              <select
                className="form-select bg-dark border-secondary text-white py-2"
                value={operator}
                onChange={e => setOperator(e.target.value)}
                required
              >
                <option value=">">{'>'} Greater than</option>
                <option value="<">{'<'} Less than</option>
                <option value=">=">{'>='} Greater or equal</option>
                <option value="<=">{'<='} Less or equal</option>
                <option value="==">{'=='} Equal to</option>
              </select>
            </div>
            <div className="col-7">
              <label className="text-muted small fw-bold text-uppercase d-block mb-2">Value ({device.sensor?.unit || '?'})</label>
              <input
                type="number"
                step="any"
                className="form-control bg-dark border-secondary text-white py-2"
                placeholder="e.g. 30, 98.6, 100"
                value={thresholdValue}
                onChange={e => setThresholdValue(e.target.value)}
                required
              />
            </div>
          </div>

          {device.threshold && (
            <div className="alert bg-warning bg-opacity-10 border border-warning border-opacity-25 text-warning py-2 px-3 small mb-3">
              <i className="bi bi-exclamation-triangle me-1"></i>
              Current: value {device.threshold.operator} {device.threshold.thresholdValue} {device.sensor?.unit}
            </div>
          )}

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light border-0 opacity-50 px-3 btn-cancel-hover" onClick={() => setIsSettingThreshold(false)}>Cancel</button>
            {device.threshold && (
              <button type="button" className="btn btn-outline-danger px-3" onClick={handleDeleteThreshold} disabled={loading}>
                Remove
              </button>
            )}
            <button type="submit" className="btn btn-warning flex-grow-1 py-2 fw-bold text-dark" disabled={loading}>
              {loading ? 'Saving...' : (device.threshold ? 'Update Threshold' : 'Set Threshold')}
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
        message={`Are you sure you want to PERMANENTLY DELETE device "${device.name}" (${device.macAddress})?\n\nAll telemetry data, thresholds, and alerts for this device will be purged. This action cannot be undone.`}
        confirmText="Delete Device"
      />
    </div>
  );
}
