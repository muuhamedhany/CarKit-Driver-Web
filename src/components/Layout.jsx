import { NavLink, Outlet } from 'react-router-dom';
import { Activity, BriefcaseBusiness, Clock, History, Home, UserRound, Zap } from 'lucide-react';

const driverNav = [
  { to: '/driver/dashboard', label: 'Dashboard',    icon: Home },
  { to: '/driver/active',    label: 'Active Order',  icon: BriefcaseBusiness },
  { to: '/driver/history',   label: 'History',       icon: History },
  { to: '/driver/profile',   label: 'Profile',       icon: UserRound },
];

const emergencyNav = [
  { to: '/emergency/dashboard', label: 'Requests',   icon: Activity },
  { to: '/emergency/active',    label: 'Active Job',  icon: Zap },
  { to: '/emergency/history',   label: 'History',     icon: Clock },
  { to: '/emergency/profile',   label: 'Profile',     icon: UserRound },
];

export default function Layout({ mode }) {
  const nav = mode === 'driver' ? driverNav : emergencyNav;
  const accentColor  = mode === 'driver' ? 'var(--accent-pink)' : 'var(--accent-blue)';

  return (
    <div className="mobile-app-shell" style={{ '--mode-accent': accentColor }}>
      <div className="mobile-app-frame">

        <main className="mobile-app-content custom-scrollbar">
          <div className="mobile-app-page">
            <Outlet />
          </div>
        </main>

        <nav className="mobile-tabbar">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `mobile-tab${isActive ? ' is-active' : ''}`}
              >
                {({ isActive }) => (
                  <>
                    <div className="mobile-tab-icon">
                      <Icon size={18} />
                    </div>
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
