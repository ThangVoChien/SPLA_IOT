import React from 'react';
import { IDashboardWidget } from '../../core/contracts.js';
import GaugeWidget from '@/components/core/GaugeWidget.jsx';
import LineChartWidget from '@/components/core/LineChartWidget.jsx';
import MetricCard from '@/components/core/MetricCard.jsx';

/**
 * FactoryWidget
 * Premium Dashboard UI for the Factory domain.
 * Integrates real-time Gauges, Line Charts, and Status-aware Cards.
 */
export class FactoryWidget extends IDashboardWidget {
  render() {
    const { telemetryPerMinute, deviceCount, telemetryHistory = [], userOrgId } = this.props;

    // Filter telemetry by sensorType AND organization ID for data isolation
    const orgTelemetry = telemetryHistory.filter(t => t.orgId === userOrgId);

    const tempValue = orgTelemetry.find(t => t.sensorType === 'Machine Temp')?.value || 0;
    const pressValue = orgTelemetry.find(t => t.sensorType === 'Pressure')?.value || 0;
    const vibrationHistory = orgTelemetry.filter(t => t.sensorType === 'Vibration History').slice(-20);

    return (
      <div className="container-fluid p-0 animate-fade-in-up">
        {/* Header Summary */}
        <div className="glass-panel p-4 mb-4 border-primary shadow-sm" style={{ borderLeft: '4px solid var(--primary)' }}>
          <h5 className="fw-bold mb-3 text-white d-flex align-items-center gap-2">
            <i className="bi bi-cpu text-primary"></i>
            Industrial Control Hub
          </h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="small text-muted mb-1 text-uppercase tracking-widest">Active Units</div>
              <div className="fs-1 fw-bold text-white">{deviceCount}</div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="small text-muted mb-1 text-uppercase tracking-widest">Total Throughput</div>
              <div className="fs-1 fw-bold text-primary">{telemetryPerMinute} <small className="fs-6 opacity-50 font-normal">pkt/s</small></div>
            </div>
          </div>
        </div>

        {/* Real-time Visualization Grid */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <GaugeWidget 
              label="Machine Temperature"
              value={tempValue}
              unit="°C"
              thresholds={{ warn: 80, critical: 95 }}
            />
          </div>
          <div className="col-md-6">
            <GaugeWidget 
              label="System Pressure"
              value={pressValue}
              unit="Psi"
              color="#8be9fd"
              thresholds={{ warn: 100, critical: 120 }}
            />
          </div>
        </div>

        {/* Analytics & Health */}
        <div className="row g-4">
          <div className="col-lg-8">
            <LineChartWidget 
              title="Vibration Profile (Dynamic Load)"
              label="Vibration"
              unit="Hz"
              data={vibrationHistory}
              color="#ff79c6"
            />
          </div>
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-4">
              <MetricCard 
                label="Unit Stability"
                value={telemetryPerMinute > 100 ? 98.4 : 94.2}
                unit="%"
                status={telemetryPerMinute > 120 ? "critical" : "success"}
              />
              <MetricCard 
                label="Cooling State"
                value={tempValue < 60 ? 100 : 85}
                unit="%"
                status={tempValue > 85 ? "warning" : "success"}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
