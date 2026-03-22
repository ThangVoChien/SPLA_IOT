import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';
import AddDeviceForm from '@/components/core/AddDeviceForm';
import DeviceActionButtons from '@/components/core/DeviceActionButtons';

export const dynamic = 'force-dynamic';

export default async function DevicesPage() {
  const session = await AuthService.getSession();

  const devices = await prisma.device.findMany({
    where: { orgId: session.orgId },
    include: {
      sensor: true,
      threshold: true
    },
    orderBy: { name: 'asc' }
  });

  const sensors = await prisma.sensor.findMany({
    select: { id: true, sensorType: true, unit: true },
    orderBy: { sensorType: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <header className="mb-5 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="fw-bold tracking-tight mb-1" style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>My <span style={{ color: 'var(--primary)' }}>Devices</span></h1>
          <p className="opacity-75 fs-5 mb-0">Manage IoT endpoints and configure alert thresholds.</p>
        </div>
        <AddDeviceForm />
      </header>

      <div className="glass-panel overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="py-4 px-4 text-start">Device</th>
                <th className="py-4 text-center">Sensor Type</th>
                <th className="py-4 text-center">MAC Address</th>
                <th className="py-4 text-center">Status</th>
                <th className="py-4 text-center">Threshold</th>
                <th className="py-4 text-end px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr><td colSpan="6" className="text-center text-muted py-5 opacity-50">No devices registered yet. Click &quot;Add Device&quot; to get started.</td></tr>
              ) : devices.map(device => (
                <tr key={device.id}>
                  <td className="px-4 py-4">
                    <div className="fw-bold fs-5" style={{ color: 'var(--info)' }}>
                      <i className="bi bi-cpu me-2 opacity-50"></i>{device.name}
                    </div>
                  </td>
                  <td className="text-center">
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 px-3 py-2">
                      {device.sensor?.sensorType || 'Unknown'}
                    </span>
                  </td>
                  <td className="text-center">
                    <code className="badge rounded-pill px-3 py-2 bg-secondary bg-opacity-10 text-muted border border-white border-opacity-10">
                      {device.macAddress}
                    </code>
                  </td>
                  <td className="text-center">
                    <span
                      className={`badge rounded-pill px-3 py-2 border ${device.status === 'ACTIVE'
                        ? 'text-success border-success border-opacity-20'
                        : 'text-danger border-danger border-opacity-20'
                        }`}
                      style={{
                        backgroundColor: device.status === 'ACTIVE'
                          ? 'rgba(80, 250, 123, 0.08)'
                          : 'rgba(255, 85, 85, 0.08)'
                      }}
                    >
                      <i className={`bi ${device.status === 'ACTIVE' ? 'bi-check-circle-fill' : 'bi-slash-circle'} me-1`}></i>
                      {device.status}
                    </span>
                  </td>
                  <td className="text-center">
                    {device.threshold ? (
                      <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-20 px-3 py-2">
                        <i className="bi bi-speedometer2 me-1"></i>
                        {device.threshold.operator} {device.threshold.thresholdValue} {device.sensor?.unit}
                      </span>
                    ) : (
                      <span className="text-muted small opacity-50">Not set</span>
                    )}
                  </td>
                  <td className="text-end px-4">
                    <DeviceActionButtons device={device} sensors={sensors} />
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
