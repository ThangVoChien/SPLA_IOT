import React from "react";
import { IDashboardWidget } from "../../core/contracts.js";
import GaugeWidget from "@/components/core/GaugeWidget.jsx";
import LineChartWidget from "@/components/core/LineChartWidget.jsx";
import MetricCard from "@/components/core/MetricCard.jsx";

/**
 * HomeWidget
 * Dashboard extension for the Home domain.
 */
export class HomeWidget extends IDashboardWidget {
  render() {
    const {
      telemetryPerMinute,
      deviceCount,
      telemetryHistory = [],
      userOrgId,
    } = this.props;

    const orgTelemetry = telemetryHistory.filter((t) => t.orgId === userOrgId);

    const roomTemp =
      orgTelemetry.find((t) => t.sensorType === "Room Temperature")?.value || 0;
    const humidity =
      orgTelemetry.find((t) => t.sensorType === "Humidity")?.value || 0;
    const airQualityHistory = orgTelemetry
      .filter((t) => t.sensorType === "Air Quality")
      .slice(-20);

    return (
      <div className="container-fluid p-0 animate-fade-in-up">
        <div
          className="glass-panel p-4 mb-4 border-primary shadow-sm"
          style={{ borderLeft: "4px solid var(--primary)" }}
        >
          <h5 className="fw-bold mb-3 text-white d-flex align-items-center gap-2">
            <i className="bi bi-house-heart-fill text-primary"></i>
            Smart Home Insights
          </h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="small text-muted mb-1 text-uppercase tracking-widest">
                Connected Home Nodes
              </div>
              <div className="fs-1 fw-bold text-white">{deviceCount}</div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="small text-muted mb-1 text-uppercase tracking-widest">
                Telemetry Throughput
              </div>
              <div className="fs-1 fw-bold text-primary">
                {telemetryPerMinute}{" "}
                <small className="fs-6 opacity-50 font-normal">msg/min</small>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <GaugeWidget
              label="Room Temperature"
              value={roomTemp}
              unit="C"
              thresholds={{ warn: 30, critical: 36 }}
            />
          </div>
          <div className="col-md-6">
            <GaugeWidget
              label="Humidity"
              value={humidity}
              unit="%"
              color="#67d5b5"
              thresholds={{ warn: 75, critical: 90 }}
            />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <LineChartWidget
              title="Air Quality Trend"
              label="Air Quality"
              unit="AQI"
              data={airQualityHistory}
              color="#ffd166"
            />
          </div>
          <div className="col-lg-4">
            <div className="d-flex flex-column gap-4">
              <MetricCard
                label="Comfort Index"
                value={roomTemp >= 20 && roomTemp <= 28 ? 96.5 : 84.1}
                unit="%"
                status={roomTemp > 32 ? "warning" : "success"}
              />
              <MetricCard
                label="Air Safety"
                value={airQualityHistory.at(-1)?.value > 150 ? 72 : 98}
                unit="%"
                status={
                  airQualityHistory.at(-1)?.value > 150 ? "critical" : "success"
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
