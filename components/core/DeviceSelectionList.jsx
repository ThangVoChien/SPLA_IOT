'use client'

import React from 'react';

/**
 * Component for device selection list in assignment modal
 */
export default function DeviceSelectionList({ loading, devices, selectedIds, onToggle }) {
  if (loading) {
    return (
      <div className="text-center py-4 opacity-50">
        <div className="spinner-border spinner-border-sm me-2"></div>
        <span className="small text-uppercase fw-bold">Scanning for nodes...</span>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="text-center py-4 bg-dark bg-opacity-10 rounded-3 border border-dashed border-white border-opacity-5">
        <i className="bi bi-slash-circle opacity-25 d-block mb-2"></i>
        <span className="small text-muted">No unassigned devices found for this organization.</span>
      </div>
    );
  }

  return (
    <div className="device-selection-list mb-4 overflow-auto px-1" style={{ maxHeight: '320px' }}>
      <div className="list-group list-group-flush rounded-3 border border-white border-opacity-5 bg-dark bg-opacity-10">
        {devices.map(device => {
          const isSelected = selectedIds.includes(device.id);
          return (
            <button
              key={device.id}
              type="button"
              onClick={() => onToggle(device.id)}
              className={`list-group-item list-group-item-action border-0 d-flex align-items-center gap-3 py-3 px-4 ${isSelected ? 'bg-primary bg-opacity-10' : 'bg-transparent text-muted'}`}
            >
              <div className={`p-2 rounded-3 ${isSelected ? 'bg-primary text-white shadow' : 'bg-dark bg-opacity-25 text-muted'}`}>
                <i className={`bi ${isSelected ? 'bi-check-lg' : 'bi-cpu-fill'}`}></i>
              </div>
              <div className="flex-grow-1 text-start">
                <div className={`fw-bold small ${isSelected ? 'text-primary' : 'text-white'}`}>{device.name}</div>
                <div className="opacity-50 tracking-tighter" style={{ fontSize: '0.7rem' }}>{device.macAddress}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
