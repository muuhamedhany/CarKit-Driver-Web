import axios from 'axios';
import { useEffect, useState } from 'react';
import { CheckCircle2, LogOut, Save, ShieldCheck, Truck } from 'lucide-react';
import { API_URL, useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
 
export default function DriverProfile() {
  const { headers, user, refreshProfile, logout } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState(user || {});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
 
  useEffect(() => { setForm(user || {}); }, [user]);
 
  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
 
    const payload = {
      full_name: form.full_name || form.name || '',
      phone: form.phone || '',
      vehicle_type: form.vehicle_type || '',
      vehicle_plate: form.vehicle_plate || '',
    };
 
    try {
      await axios.put(`${API_URL}/drivers/me`, payload, { headers });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t('Could not save profile.'));
    } finally {
      setSaving(false);
    }
  };
 
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const displayName = form.full_name || form.name || 'Driver';
  const profilePhoto = form.profile_photo_url || '';
  const approvalStatus = form.approval_status || 'pending';
  const vehicleType = form.vehicle_type || 'Vehicle';
  const vehiclePlate = form.vehicle_plate || '-';
 
  return (
    <div className="page-stack">
 
      <div className="screen-heading">
        <div className="screen-heading-main">
          <ProfileAvatar className="profile-heading-avatar" src={profilePhoto} name={displayName} />
          <div className="screen-title-copy">
            <h2>{t('Driver Profile')}</h2>
          </div>
        </div>
      </div>
 
      {saved && (
        <div className="banner status-banner">
          <CheckCircle2 size={15} /> {t('Profile updated successfully!')}
        </div>
      )}
 
      {error && (
        <div className="alert">
          {error}
        </div>
      )}
 
      <div className="panel app-soft-card profile-summary-card">
        <div className="profile-summary-top">
          <div className="profile-main">
            <p className="profile-eyebrow">{t('Driver account')}</p>
            <h3>{displayName}</h3>
            <p className="truncate">{form.email}</p>
          </div>
        </div>
 
        <div className="profile-meta-grid">
          <div className="profile-meta-card">
            <span>{t('Vehicle')}</span>
            <strong>
              <Truck size={13} />
              {t(vehicleType)}
            </strong>
          </div>
          <div className="profile-meta-card">
            <span>{t('Plate')}</span>
            <strong>{vehiclePlate}</strong>
          </div>
        </div>
      </div>
 
      <div className="panel app-soft-card profile-edit-card">
        <div className="panel-accent" />
        <div className="panel-body padded-left">
          <h3 className="section-label purple">
            {t('Edit Information')}
          </h3>
 
          <div className="form-grid">
            <Field label="Full Name" value={form.full_name || form.name || ''} onChange={set('full_name')} />
            <Field label="Phone Number" value={form.phone || ''} onChange={set('phone')} />
            <Field label="Vehicle Type" value={form.vehicle_type || ''} onChange={set('vehicle_type')} />
            <Field label="Vehicle Plate" value={form.vehicle_plate || ''} onChange={set('vehicle_plate')} />
          </div>
        </div>
      </div>
 
      <div className="form-actions profile-actions">
        <button className="button primary" onClick={save} disabled={saving}>
          <Save size={15} />
          {saving ? t('Saving...') : t('Save Profile')}
        </button>
        <button className="button danger" onClick={logout}>
          <LogOut size={15} /> {t('Logout')}
        </button>
      </div>
    </div>
  );
}
 
function ProfileAvatar({ src, name, className = '' }) {
  const initials = (name || 'Driver')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'D';
 
  return (
    <div className={`profile-avatar ${src ? 'has-photo' : ''} ${className}`}>
      {src && (
        <img
          src={src}
          alt={`${name || 'Driver'} profile`}
          onError={(event) => {
            event.currentTarget.style.display = 'none';
            event.currentTarget.parentElement?.classList.remove('has-photo');
          }}
        />
      )}
      <span>{initials}</span>
    </div>
  );
}
 
function Field({ label, value, onChange, type = 'text', placeholder }) {
  const { t } = useLanguage();
  return (
    <label>
      <span>{t(label)}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder ? t(placeholder) : ''} />
    </label>
  );
}
