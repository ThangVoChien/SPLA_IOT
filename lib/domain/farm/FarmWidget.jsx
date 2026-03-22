'use client'

import { IDashboardWidget } from '../../core/contracts.js';

/**
 * FarmWidget - Displays farm-specific dashboard metrics
 * Implements IDashboardWidget contract
 */
export class FarmWidget extends IDashboardWidget {
  render() {
    const { device, sensor } = this.props;

    if (!device || !sensor) {
      return <div className="text-muted small">No farm data available</div>;
    }

    const value = device.lastValue || 0;
    const unit = sensor.unit || '';
    const trend = device.trend || 'stable';

    // Determine farm-specific styling based on sensor type
    let alertColor = 'info';
    let icon = 'bi-leaf';

    if (sensor.sensorType?.includes('Moisture')) {
      icon = 'bi-water';
      alertColor = value < 30 ? 'warning' : value < 15 ? 'danger' : 'success';
    } else if (sensor.sensorType?.includes('Temperature')) {
      icon = 'bi-thermometer';
      alertColor = value > 35 ? 'danger' : value > 28 ? 'warning' : 'success';
    } else if (sensor.sensorType?.includes('pH')) {
      icon = 'bi-funnel';
      alertColor = Math.abs(value - 7) > 1 ? 'warning' : 'success';
    }

    return (
      <div className={`card border-${alertColor} mb-3`} style={{ minHeight: '180px' }}>
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="card-title fw-bold mb-0 text-white">
              <i className={`bi ${icon} me-2`}></i>
              {sensor.sensorType}
            </h6>
            <span className={`badge bg-${alertColor}`}>
              {value} {unit}
            </span>
          </div>

          <div className="progress mb-2" style={{ height: '8px' }}>
            <div
              className={`progress-bar bg-${alertColor}`}
              role="progressbar"
              style={{ width: `${Math.min(value, 100)}%` }}
              aria-valuenow={value}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>

          <small className="text-muted d-block mb-2">
            Device: {device.name}
          </small>
          
          <small className={`text-${trend === 'up' ? 'danger' : trend === 'down' ? 'success' : 'info'}`}>
            {trend === 'up' && '↗ Increasing'}
            {trend === 'down' && '↘ Decreasing'}
            {trend === 'stable' && '→ Stable'}
          </small>
        </div>
      </div>
    );
  }
}
