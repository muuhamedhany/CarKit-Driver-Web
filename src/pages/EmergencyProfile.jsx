import { Activity, BriefcaseBusiness, LogOut, Phone, ShieldCheck, Wrench } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function EmergencyProfile() {
  const { user, logout } = useAuth();
  const displayName = user?.full_name || user?.name || 'Emergency employee';
  const phone = user?.phone || '-';
  const providerName = user?.provider_name || 'Provider';
  const serviceName = user?.service_type || 'Emergency service';
  const status = user?.is_online ? 'Online' : 'Offline';
  const cancellationCount = user?.cancellation_count ?? 0;

  return (
    <div className="page-stack">
      <div className="screen-heading">
        <div className="screen-heading-main">
          <ProfileAvatar name={displayName} />
          <div className="screen-title-copy">
            <p className="app-page-kicker">Emergency Account</p>
            <h2>Profile</h2>
          </div>
        </div>
      </div>

      <div className="panel app-soft-card profile-summary-card emergency-profile-card">
        <div className="profile-summary-top">
          <div className="profile-main">
            <p className="profile-eyebrow emergency">Emergency employee</p>
            <h3>{displayName}</h3>
            <p>{providerName}</p>
          </div>
          <span className={`status-pill ${user?.is_online ? 'online' : 'offline'}`}>
            {status}
          </span>
        </div>

        <div className="profile-meta-grid">
          <div className="profile-meta-card">
            <span>Phone</span>
            <strong>
              <Phone size={13} />
              {phone}
            </strong>
          </div>
          <div className="profile-meta-card">
            <span>Service</span>
            <strong>
              <Wrench size={13} />
              {serviceName}
            </strong>
          </div>
          <div className="profile-meta-card">
            <span>Role</span>
            <strong>
              <ShieldCheck size={13} />
              Emergency
            </strong>
          </div>
          <div className="profile-meta-card">
            <span>Cancellations</span>
            <strong>
              <Activity size={13} />
              {cancellationCount}
            </strong>
          </div>
        </div>
      </div>

      <div className="panel app-soft-card profile-edit-card">
        <div className="panel-accent emergency" />
        <div className="panel-body padded-left">
          <h3 className="section-label blue">
            <BriefcaseBusiness size={12} /> Account
          </h3>
          <p className="compact-meta">
            Emergency employee accounts are managed by the service provider.
          </p>
        </div>
      </div>

      <div className="form-actions profile-actions">
        <button className="button danger" type="button" onClick={logout}>
          <LogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );
}

function ProfileAvatar({ name }) {
  const initials = (name || 'Emergency')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'E';

  return (
    <div className="profile-avatar profile-heading-avatar emergency-profile-avatar">
      <span>{initials}</span>
    </div>
  );
}
