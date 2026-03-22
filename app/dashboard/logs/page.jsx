import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';

export default async function SystemLogsPage() {
  // Directly querying Log collection (Admin only route in a real scenario)
  const logs = await prisma.log.findMany({
    include: { user: true },
    orderBy: { timestamp: 'desc' },
    take: 100
  });

  return (
    <div className="animate-fade-in">
      <header className="mb-5">
        <h1 className="fw-bold tracking-tight mb-1" style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>Audit <span style={{ color: 'var(--primary)' }}>Logs</span></h1>
        <p className="opacity-75 fs-5 mb-0">Security-first observability of all write operations and role changes.</p>
      </header>

      <div className="glass-panel overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="py-4 px-4 text-start">Event Timeline</th>
                <th className="py-4 text-center">Initiator</th>
                <th className="py-4 text-center">Action Type</th>
                <th className="py-4 text-center">Extended Metadata</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-muted py-5 opacity-50">No security events recorded yet.</td></tr>
              ) : logs.map(log => (
                <tr key={log.id}>
                  <td className="px-4 py-4">
                    <div className="fw-bold text-white">{log.timestamp.toLocaleDateString()}</div>
                    <div className="text-muted small">{log.timestamp.toLocaleTimeString()}</div>
                  </td>
                  <td>
                    <span className="badge bg-secondary bg-opacity-10 text-muted border border-white border-opacity-10 px-3 py-2 rounded-pill font-monospace">
                      {log.user?.username || 'System'}
                    </span>
                  </td>
                  <td>
                    <span className="badge bg-primary bg-opacity-20 text-primary px-3 py-2 rounded-pill fw-bold border border-primary border-opacity-20">
                      {log.action}
                    </span>
                  </td>
                  <td style={{ minWidth: '300px' }}>
                    <div className="bg-black bg-opacity-30 p-2 rounded border border-white border-opacity-5">
                      <pre className="text-success small m-0 overflow-auto" style={{ fontSize: '0.75rem', maxHeight: '80px' }}>
                        {JSON.stringify(JSON.parse(log.details), null, 2)}
                      </pre>
                    </div>
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

