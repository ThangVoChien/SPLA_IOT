'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { deviceUtils } from '@/lib/utils/DeviceUtils';
import Modal from '@/components/core/Modal';

export default function AddDeviceForm() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sensors, setSensors] = useState([]);
  const router = useRouter();

  // Form states
  const [name, setName] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [sensorId, setSensorId] = useState('');

  // Optional Threshold states
  const [enableThreshold, setEnableThreshold] = useState(false);
  const [operator, setOperator] = useState('>');
  const [thresholdValue, setThresholdValue] = useState('');

  useEffect(() => {
    if (show) {
      fetch('/api/sensors/list')
        .then(r => r.ok ? r.json() : [])
        .then(setSensors)
        .catch(() => setSensors([]));
    }
  }, [show]);

  const selectedSensor = sensors.find(s => s.id === sensorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = { name, macAddress, sensorId };
    if (enableThreshold && thresholdValue !== '') {
      payload.operator = operator;
      payload.thresholdValue = thresholdValue;
    }

    const res = await deviceUtils('POST', payload);
    if (res.error) {
      setError(res.error);
    } else {
      setShow(false);
      setName('');
      setMacAddress('');
      setSensorId('');
      setEnableThreshold(false);
      setOperator('>');
      setThresholdValue('');
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <>
      <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-lg" onClick={() => setShow(true)}>
        <i className="bi bi-plus-lg me-2"></i>Add Device
      </button>

      <Modal isOpen={show} onClose={() => setShow(false)} title="Register New Device">
        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-muted small fw-bold text-uppercase d-block mb-2">Device Name</label>
            <input
              className="form-control bg-dark border-secondary text-white py-2"
              placeholder="e.g. Soil Sensor A1, Heart Monitor #3"
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
              placeholder="e.g. AA:BB:CC:DD:EE:FF"
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
              <option value="">Select a sensor type...</option>
              {sensors.map(s => (
                <option key={s.id} value={s.id}>{s.sensorType} ({s.unit})</option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <div className="form-check form-switch mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="enableThreshold"
                checked={enableThreshold}
                onChange={e => setEnableThreshold(e.target.checked)}
              />
              <label className="form-check-label text-white ms-2" htmlFor="enableThreshold">
                Configure Alert Threshold Now
              </label>
            </div>

            {enableThreshold && (
              <div className="row bg-black bg-opacity-25 p-3 rounded border border-white border-opacity-10 animate-fade-in">
                <div className="col-5">
                  <label className="text-muted small fw-bold text-uppercase d-block mb-2">Operator</label>
                  <select
                    className="form-select bg-dark border-secondary text-white py-2"
                    value={operator}
                    onChange={e => setOperator(e.target.value)}
                    required={enableThreshold}
                  >
                    <option value=">">{'>'} Greater than</option>
                    <option value="<">{'<'} Less than</option>
                    <option value=">=">{'>='} Greater or equal</option>
                    <option value="<=">{'<='} Less or equal</option>
                    <option value="==">{'=='} Equal to</option>
                  </select>
                </div>
                <div className="col-7">
                  <label className="text-muted small fw-bold text-uppercase d-block mb-2">
                    Value {selectedSensor ? `(${selectedSensor.unit})` : ''}
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="form-control bg-dark border-secondary text-white py-2"
                    placeholder="e.g. 30, 98.6"
                    value={thresholdValue}
                    onChange={e => setThresholdValue(e.target.value)}
                    required={enableThreshold}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-outline-light border-0 opacity-50 px-3 btn-cancel-hover" onClick={() => setShow(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary flex-grow-1 py-2 fw-bold" disabled={loading}>
              {loading ? 'Registering...' : 'Register Device'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
