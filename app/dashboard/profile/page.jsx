import { prisma } from '@/lib/db/prisma';
import { AuthService } from '@/lib/services/AuthService';
import { redirect } from 'next/navigation';
import TelegramForm from '@/components/core/TelegramForm';
import ChangePasswordForm from '@/components/core/ChangePasswordForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const session = await AuthService.getSession();

  if (!session || !session.userId) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      username: true,
      role: true,
      telegram: {
        select: {
          chatId: true,
          isEnabled: true
        }
      },
      organization: { select: { name: true } }
    }
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto" style={{ maxWidth: '800px' }}>
      <header className="mb-5">
        <h1 className="fw-bold tracking-tight mb-1" style={{ fontSize: '2.5rem', color: 'var(--text-main)' }}>My <span style={{ color: 'var(--primary)' }}>Profile</span></h1>
        <p className="opacity-75 fs-5 mb-0">Manage your personal settings and notification preferences.</p>
      </header>

      <div className="glass-panel p-5">
        <div className="d-flex align-items-center gap-4 mb-5 pb-4 border-bottom border-white border-opacity-10">
          <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center border border-primary border-opacity-25" style={{ width: '80px', height: '80px' }}>
            <i className="bi bi-person-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
          </div>
          <div>
            <h2 className="mb-1 text-white">{user.username}</h2>
            <div className="d-flex gap-2 align-items-center mt-2">
              <span className={`badge bg-${user.role === 'ADMIN' ? 'danger' : 'success'} bg-opacity-25 text-${user.role === 'ADMIN' ? 'danger' : 'success'} border border-${user.role === 'ADMIN' ? 'danger' : 'success'} border-opacity-20 px-3 py-1`}>
                {user.role}
              </span>
              <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-20 px-3 py-1">
                <i className="bi bi-building me-1 opacity-75"></i> {user.organization.name}
              </span>
            </div>
          </div>
        </div>

        <ChangePasswordForm />
        <TelegramForm initialChatId={user.telegram?.chatId || ''} initialEnabled={user.telegram?.isEnabled ?? true} />
      </div>
    </div>
  );
}
