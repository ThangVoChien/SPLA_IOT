'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminUtils } from '@/lib/utils/AdminUtils';
import Modal from '@/components/core/Modal';

export default function AddSensorForm() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Form states
  const [sensorType, setSensorType] = useState('');
  const [unit, setUnit] = useState('');
  const [dataType, setDataType] = useState('FLOAT');
  const [alertTemplate, setAlertTemplate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await adminUtils('sensors', 'POST', { name, unit, alertTemplate });
    if (res.error) {
      setError(res.error);
    } else {
      setShow(false);
      setName('');
      setUnit('');
      setDataType('FLOAT');
      setAlertTemplate('');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-lg" onClick={() => setShow(true)}>
        <i className="bi bi-plus-lg me-2"></i>Register Sensor
      </button>

      <Modal isOpen={show} onClose={() => setShow(false)} title="Register New Sensor">
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Sensor Type</label>
            <input
              className="form-control bg-dark border-secondary text-white py-2"
              placeholder="e.g. Temperature, Humidity, Pressure"
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
                placeholder="e.g. °C, %, hPa"
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
              placeholder="e.g. {device} exceeded {value}{unit}"
              value={alertTemplate}
              onChange={e => setAlertTemplate(e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light border-0 opacity-50 px-3 btn-cancel-hover" onClick={() => setShow(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-grow-1 py-2 fw-bold" disabled={loading}>
              {loading ? 'Registering...' : 'Register Sensor'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
