'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IGroupSidebar } from '@/lib/core/contracts';

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: 'bi-grid-1x2-fill' },
  { label: 'My Devices', href: '/dashboard/devices', icon: 'bi-cpu' },
  { label: 'Profile Settings', href: '/dashboard/profile', icon: 'bi-person-badge' },
];

const ADMIN_ITEMS = [
  { label: 'Organizations', href: '/dashboard/organizations', icon: 'bi-buildings' },
  { label: 'Identity Control', href: '/dashboard/users', icon: 'bi-shield-lock-fill' },
  { label: 'Sensor Domain', href: '/dashboard/sensors', icon: 'bi-broadcast-pin' },
  { label: 'Audit Logs', href: '/dashboard/logs', icon: 'bi-journal-code' },
];

export default function Sidebar({ userRole }) {
  const pathname = usePathname();

  // SPLA Extension: Dynamically resolve domain-specific sidebar items
  const SidebarClass = IGroupSidebar.class;
  const domainItem = SidebarClass ? new SidebarClass() : null;

  // Build the unified navigation list
  const navItems = [...NAV_ITEMS];
  const adminItems = [...ADMIN_ITEMS];

  if (domainItem) {
    const item = {
      label: domainItem.getLabel(),
      href: domainItem.getHref(),
      icon: domainItem.getIcon()
    };

    if (domainItem.isAdmin()) {
      adminItems.push(item);
    } else {
      navItems.push(item);
    }
  }


  const renderNavItems = (items) => (
    <ul className="nav nav-pills flex-column px-2">
      {items.map(item => {
        const isActive = pathname === item.href;
        return (
          <li className="nav-item" key={item.href}>
            <Link
              href={item.href}
              className={`nav-link d-flex align-items-center gap-2 py-2 px-3 mb-1 ${isActive ? 'active shadow-sm' : ''}`}
            >
              <i className={`bi ${item.icon} fs-6`}></i>
              <span className="fw-semibold small">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const handleLogout = async () => {
    try {
      await authUtils('LOGOUT');
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <aside className="glass-sidebar min-vh-100 d-flex flex-column py-3" style={{ width: '260px', position: 'fixed', overflowY: 'auto' }}>
      <a href="/">
        <div className="px-4 mb-4 d-flex align-items-center">
          <div className="bg-primary rounded-3 p-2 me-3 shadow-lg d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
            <i className="bi bi-stack text-white fs-4"></i>
          </div>
          <span className="fs-5 fw-bold tracking-tight text-white">IOT CORE <span style={{ color: 'var(--primary)' }}>SDK</span></span>
        </div>
      </a>

      <div className="mb-3">
        <h6 className="px-4 mb-2 text-uppercase fw-bold opacity-50 small" style={{ letterSpacing: '0.1em', color: 'var(--text-main)' }}>Platform</h6>
        {renderNavItems(navItems)}
      </div>

      {userRole === 'ADMIN' && (
        <div className="mb-3">
          <h6 className="px-4 mb-2 text-uppercase fw-bold opacity-50 small" style={{ letterSpacing: '0.1em', color: 'var(--text-main)' }}>Governance</h6>
          {renderNavItems(adminItems)}
        </div>
      )}

      <div className="mt-auto px-3 pb-3">
        <button
          onClick={handleLogout}
          className="nav-link d-flex align-items-center gap-2 py-2 px-3 rounded-4 border border-danger border-opacity-25 text-danger hover-bg-danger shadow-sm transition-all w-100 text-start"
          style={{ background: 'rgba(255, 85, 85, 0.05)', borderStyle: 'solid' }}
        >
          <i className="bi bi-box-arrow-left fs-5"></i>
          <span className="fw-bold fs-5">Logout</span>
        </button>
      </div>
    </aside>
  );
}


