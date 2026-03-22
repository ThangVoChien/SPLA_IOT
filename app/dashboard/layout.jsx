import Sidebar from '@/components/core/Sidebar';
import { RealTimeProvider } from '@/components/core/RealTimeProvider';
import { AuthService } from '@/lib/services/AuthService';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }) {
  const session = await AuthService.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  return (
    <RealTimeProvider>
      <div className="d-flex w-100 min-vh-100 overflow-hidden">
        <Sidebar userRole={session?.role} />
        <main className="flex-grow-1 overflow-auto animate-fade-in" style={{ marginLeft: '280px', padding: '2rem 3rem' }}>
          {children}
        </main>
      </div>
    </RealTimeProvider>
  );
}


