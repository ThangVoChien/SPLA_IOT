import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';
import AddUserForm from '@/components/core/AddUserForm';
import UserActionButtons from '@/components/core/UserActionButtons';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const session = await AuthService.getSession();
  if (!session) return null;

  // We explicitly fetch users in the admin's organization.
  // UPDATE: User requested Global Admin visibility across all tenants.
  // Bypassing tenant extension safely.
  const users = await prisma.user.findMany({
    include: { organization: true },
    orderBy: { username: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <header className="mb-5 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="fw-bold tracking-tight mb-1" style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>Identity <span style={{ color: 'var(--primary)' }}>Control</span></h1>
          <p className="opacity-75 fs-5 mb-0">Global administrative panel for tenant hierarchy and security.</p>
        </div>
        <AddUserForm />
      </header>


      <div className="glass-panel overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th className="py-4 px-4 text-start">Global Identity</th>
                <th className="py-4 text-center">Access Privilege</th>
                <th className="py-4 text-center">Associated Organization</th>
                <th className="py-4 text-center px-4">Governance</th>

              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-muted py-5 opacity-50">No users found in global directory.</td></tr>
              ) : users.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: '45px', height: '45px' }}>
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold fs-5" style={{ color: '#ffffff' }}>{user.username}</div>
                        <div style={{ color: '#8be9fd', fontSize: '0.8rem', fontWeight: 'bold' }}>UID: {user.id.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${user.role === 'ADMIN' ? 'bg-danger bg-opacity-10 text-danger border-danger' : 'bg-primary bg-opacity-10 text-primary border-primary'} border border-opacity-25 px-3 py-2 rounded-pill`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="fw-bold mb-1" style={{ color: '#ffffff' }}>{user.organization?.name}</div>
                  </td>
                  <td className="text-end px-4">


                    <UserActionButtons user={user} currentUserId={session.userId} />
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

