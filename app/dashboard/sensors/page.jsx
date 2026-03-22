import { prisma } from '@/lib/db/prisma';
import AddSensorForm from '@/components/core/AddSensorForm';
import SensorActionButtons from '@/components/core/SensorActionButtons';

export const dynamic = 'force-dynamic';

export default async function SensorsPage() {
  const sensors = await prisma.sensor.findMany({
    include: {
      _count: {
        select: { devices: true }
      }
    },
    orderBy: { sensorType: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <header className="mb-5 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="fw-bold tracking-tight mb-1" style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>Sensor <span style={{ color: 'var(--primary)' }}>Domain</span></h1>
          <p className="opacity-75 fs-5 mb-0">Manage sensor types, units, and alert templates across the platform.</p>
        </div>
        <AddSensorForm />
      </header>

      <div className="glass-panel overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="py-4 px-4 text-start">Sensor Type</th>
                <th className="py-4 text-center">Unit</th>
                <th className="py-4 text-center">Data Type</th>
                <th className="py-4 text-center">Alert Template</th>
                <th className="py-4 text-center">Linked Devices</th>
                <th className="py-4 text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sensors.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted py-5 opacity-50">No sensors registered yet. Click "Register Sensor" to add one.</td></tr>
              ) : sensors.map(sensor => (
                <tr key={sensor.id}>
                  <td className="px-4 py-4">
                    <div className="fw-bold fs-5" style={{ color: 'var(--info)' }}>
                      <i className="bi bi-broadcast-pin me-2 opacity-50"></i>{sensor.sensorType}
                    </div>
                  </td>
                  <td>
                    <code className="badge rounded-pill px-3 py-2 bg-secondary bg-opacity-10 text-muted border border-white border-opacity-10">{sensor.unit}</code>
                  </td>
                  <td>
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-3 py-2">
                      {sensor.dataType}
                    </span>
                  </td>
                  <td style={{ maxWidth: '250px' }}>
                    {sensor.alertTemplate ? (
                      <div className="bg-black bg-opacity-30 p-2 rounded border border-white border-opacity-5">
                        <code className="text-warning small" style={{ fontSize: '0.75rem' }}>{sensor.alertTemplate}</code>
                      </div>
                    ) : (
                      <span className="text-muted small opacity-50">No template</span>
                    )}
                  </td>
                  <td>
                    <span className="bg-purple bg-opacity-5 px-3 py-2 rounded text-primary fw-bold" style={{ fontSize: '0.9rem' }}>
                      <i className="bi bi-cpu me-1"></i>{sensor._count.devices} device{sensor._count.devices !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="text-end px-4">
                    <SensorActionButtons sensor={sensor} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
