'use client'

/**
 * WidgetFactory for the SPLA UI Engine.
 * Consumes the active domain's IWidgetManifest to render specific dashboards seamlessly.
 */
export default function WidgetFactory({ manifest, telemetry, isAlerting }) {
  if (!manifest) return <div>No domain manifest active.</div>;

  const widgets = manifest.getRequiredWidgets();
  
  return (
    <div className="row g-4 mt-2">
      {widgets.map(widgetName => (
        <div className="col-md-6" key={widgetName}>
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h5 className="card-title text-muted text-uppercase mb-3">{widgetName}</h5>
              <div className="display-4 fw-bold text-primary">
                {telemetry ? telemetry.value : '--'}
              </div>
              {isAlerting && (
                <div className="alert alert-danger mt-3 mb-0 fw-semibold">
                  ⚠️ Critical threshold breach monitored
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
