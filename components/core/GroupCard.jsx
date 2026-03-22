'use client'

import React from 'react';

/**
 * Entity card component
 */
export default function GroupCard({ group, icon, onEdit, onDelete, onAssign }) {
  const nodeCount = (group.devices || group.nodes || []).length || group.deviceCount || 0;
  const isActive = group.status === 'ACTIVE' || group.active !== false;

  return (
    <div className="card h-100 border-0 shadow-sm transition-all hover-translate-y glass-panel">
      <div className="card-body p-5">
        <h3
          className="h4 fw-bold mb-3 text-white tracking-tight"
          style={{ height: '1.2em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {group.name}
        </h3>
        <p
          className="text-muted small mb-4 opacity-90 custom-scrollbar"
          style={{ height: '4.8em', lineHeight: '1.6', overflowY: 'auto', paddingRight: '4px' }}
        >
          {group.description || "Active domain entity managing specialized IoT telemetry and operational infrastructure."}
        </p>

        {/* Unified Status & Metadata Line */}
        <div className="d-flex align-items-center gap-3 mb-5 pt-3 border-top border-white border-opacity-5">
          <div className="d-flex align-items-center gap-2 fw-semibold text-primary">
            <i className="bi bi-cpu fs-5"></i>
            <span className="text-muted">{nodeCount} Nodes Linked</span>
          </div>
          <div className="vr opacity-10" style={{ height: '1.2rem' }}></div>
          <div className="d-flex align-items-center gap-2 fw-bold small">
            <div className={isActive ? 'text-success' : 'text-danger'}>
              <i className={`bi ${isActive ? 'bi-check-circle-fill' : 'bi-dash-circle-fill'} fs-6`}></i>
              <span className="text-uppercase tracking-wider">{isActive ? 'Active' : 'Offline'}</span>
            </div>
          </div>
        </div>

        <GroupActionButtons onAssign={onAssign} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

/**
 * Component for card action buttons
 */
function GroupActionButtons({ onAssign, onEdit, onDelete }) {
  return (
    <div className="d-flex flex-column gap-3">
      <button
        onClick={onAssign}
        className="btn btn-primary w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-3 rounded-4 shadow-sm"
      >
        <i className="bi bi-plus-square-fill fs-5"></i>
        <span>Assign Device</span>
      </button>

      <div className="d-flex gap-3">
        <button
          onClick={onEdit}
          className="btn btn-info w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 border border-white border-opacity-5"
        >
          <i className="bi bi-pencil-square"></i>
          <span>Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="btn btn-danger bg-opacity-10 text-danger w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 rounded-3 border border-danger border-opacity-10"
        >
          <i className="bi bi-trash"></i>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
