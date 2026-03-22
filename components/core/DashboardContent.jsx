'use client'

import React from 'react';
import { useLiveStream } from '@/components/core/RealTimeProvider';

import { IDashboardWidget } from '@/lib/core/contracts';

export default function DashboardContent() {
    const liveData = useLiveStream();
    const { telemetryHistory = [], alertHistory = [], telemetryPerMinute = 0, deviceCount = 0, connected } = liveData;

    // [Build-Time Injection Point]: Identify the widget class for this build's domain
    const WidgetClass = IDashboardWidget.class;

    // [Injection via constructor]: Instantiate the domain widget only if plugged
    const domainWidget = WidgetClass ? new WidgetClass(liveData) : null;

    return (
        <div className="animate-fade-in">
            <header className="mb-5 d-flex justify-content-between align-items-center">
                <div>
                    <h1 className="fw-bold tracking-tight mb-1" style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>Platform <span style={{ color: 'var(--primary)' }}>Overview</span></h1>
                    <p className="opacity-75 fs-5 mb-0">Unified real-time monitoring across all SPLA tenant domains.</p>
                </div>
                <div className="glass-panel p-2 px-3 d-flex align-items-center gap-2 border-primary border-opacity-10">
                    <i className={`bi bi-broadcast ${connected ? 'text-success' : 'text-danger animate-pulse'}`}></i>
                    <span className="small fw-bold opacity-75"><span className={`text-${connected ? 'success' : 'danger'}`}>{connected ? 'CORE STREAM LIVE' : 'STREAM DISCONNECTED'}</span></span>
                </div>
            </header>

            <div className="row g-4 mb-5">
                <div className="row col-md-4">
                    <div className="col-md-12 mb-1">
                        <div className="glass-panel p-4 h-100 border-primary" style={{ borderLeft: '4px solid var(--primary)' }}>
                            <h6 className="text-muted fw-bold small text-uppercase mb-3">Active Telemetry Flow</h6>
                            <h2 className="fw-bold mb-0">{telemetryPerMinute} <small className="fs-6 opacity-50 fw-normal">msg/min</small></h2>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="glass-panel p-4 h-100 border-success" style={{ borderLeft: '4px solid var(--success)' }}>
                            <h6 className="text-muted fw-bold small text-uppercase mb-3">Active Devices</h6>
                            <h2 className="fw-bold mb-0 text-white">{deviceCount}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-md-8 mt-0">
                    <div className="glass-panel p-4 h-100">
                        <h5 className="fw-bold mb-4 text-white"><i className="bi bi-exclamation-triangle-fill me-2 text-danger"></i>Critical Alerts Feed</h5>
                        <div style={{ maxHeight: '230px', overflowY: 'auto', paddingRight: '8px' }} className="custom-scrollbar">
                            {alertHistory.length === 0 ? (
                                <div className="text-center py-5 opacity-50 border border-dashed rounded-3 border-white border-opacity-10">
                                    <div className="fs-1 mb-2"><i className="bi bi-shield-check text-success"></i></div>
                                    <div className="fw-bold">No breaches detected</div>
                                    <div className="small">All thresholds within normal bounds</div>
                                </div>
                            ) : (
                                <div className="vstack gap-3">
                                    {alertHistory.map((a, i) => (
                                        <div key={i} className="p-3 rounded-3 bg-danger bg-opacity-10 border border-danger border-opacity-20 animate-fade-in shadow-sm">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span className="badge bg-danger rounded-pill px-2" style={{ fontSize: '0.65rem' }}>{a.severity}</span>
                                                    <span className="text-white fw-bold small opacity-75">{a.deviceName || a.macAddress}</span>
                                                </div>
                                                <span className="text-muted small font-monospace" style={{ fontSize: '0.75rem' }}>
                                                    {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="fw-semibold text-white small" style={{ lineHeight: '1.4' }}>{a.message}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SPLA Domain Extension: Renders the injected composite widget only if it exists */}
            {domainWidget && (
                <div className="mt-4 animate-fade-in">
                    {domainWidget.render()}
                </div>
            )}
        </div>
    );
}
