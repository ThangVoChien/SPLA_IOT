import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';
import AddOrgForm from '@/components/core/AddOrgForm';
import OrgActionButtons from '@/components/core/OrgActionButtons';

export default async function OrganizationsPage() {
  const session = await AuthService.getSession();
  const organizations = await prisma.organization.findMany({
    include: {
      _count: {
        select: { users: true, devices: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  return (
    <div className="animate-fade-in">
      <header className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom border-white border-opacity-10">
        <div>
          <h1 className="display-5 fw-bold text-white m-0">Global <span style={{ color: 'var(--primary)' }}>Organizations</span></h1>
          <p className="text-muted m-0 mt-1 fs-5 opacity-75">Manage tenant boundaries and infrastructure isolation.</p>
        </div>
        <AddOrgForm />
      </header>

      <div className="glass-panel border-0 shadow-lg overflow-hidden">
        <table className="table table-dark table-hover m-0 align-middle">
          <thead>
            <tr className="border-bottom border-white border-opacity-10">
              <th className="ps-4 py-4 text-muted small text-uppercase fw-bold text-start">Organization Identity</th>
              <th className="py-4 text-muted small text-uppercase fw-bold text-start">System Reference</th>
              <th className="py-4 text-muted small text-uppercase fw-bold text-center">Identities</th>
              <th className="py-4 text-muted small text-uppercase fw-bold text-center">Endpoints</th>
              <th className="pe-4 py-4 text-center text-muted small text-uppercase fw-bold">Governance</th>




            </tr>
          </thead>
          <tbody>
            {organizations.map(org => (
              <tr key={org.id} className="border-bottom border-white border-opacity-5">
                <td className="ps-4 py-4">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: '45px', height: '45px' }}>
                      {org.name[0].toUpperCase()}
                    </div>
                    <span className="fw-bold text-white fs-5">{org.name}</span>
                  </div>
                </td>
                <td className="py-4">
                  <code className="small text-muted font-monospace opacity-50">{org.id.toUpperCase()}</code>
                </td>
                <td className="py-4 text-start">
                  <span className="badge bg-purple bg-opacity-10 text-info border border-purple border-opacity-25 px-3 py-2 rounded-pill fw-bold">
                    {org._count.users} Users
                  </span>
                </td>
                <td className="py-4 text-start">
                  <span className="badge bg-primary bg-opacity-10 text-info border border-primary border-opacity-25 px-3 py-2 rounded-pill fw-bold">
                    {org._count.devices} Nodes
                  </span>
                </td>

                <td className="pe-4 text-end">
                  <OrgActionButtons 
                    org={org} 
                    currentOrgId={session?.orgId} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



