import axios from 'axios';
import { useEffect, useState } from 'react';
import MapTracker from '../components/MapTracker';
import { AlertTriangle, CheckCircle2, CreditCard, MapPin, Phone, User, X, Zap } from 'lucide-react';
import { API_URL, useAuth } from '../contexts/AuthContext';

const reasons = ['Vehicle breakdown', 'Emergency of my own', 'Cannot locate customer', 'Other'];

export default function EmergencyActiveJob() {
  const { headers } = useAuth();
  const [job, setJob] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [otherReason, setOtherReason] = useState('');
  const [updating, setUpdating] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const res = await axios.get(`${API_URL}/emergency/requests/my-active`, { headers });
    setJob(res.data?.data || null);
  };

  const updateLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        axios.post(`${API_URL}/emergency/employees/location`, {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }, { headers }).catch(() => { });
      },
      () => { },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 15000 }
    );
  };

  const updateStatus = async (status) => {
    if (!job?.request_id) return;
    setUpdating(status);
    setError('');
    try {
      await axios.patch(`${API_URL}/emergency/requests/${job.request_id}/status`, { status }, { headers });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update emergency status.');
    } finally {
      setUpdating('');
    }
  };

  const cancel = async () => {
    await axios.post(`${API_URL}/emergency/requests/${job.request_id}/cancel`, {
      reason: reason === 'Other' ? otherReason : reason,
    }, { headers });
    setCancelOpen(false);
    await load();
  };

  useEffect(() => {
    load();
    updateLocation();
    const id = setInterval(load, 8000);
    const locId = setInterval(updateLocation, 15000);
    return () => {
      clearInterval(id);
      clearInterval(locId);
    };
  }, []);

  if (!job) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Zap size={36} /></div>
        <p>No active emergency job.</p>
      </div>
    );
  }

  const steps = ['accepted', 'arrived', 'completed'];
  const stepIdx = steps.indexOf(job.status);

  return (
    <div className="page-stack">
      <div className="screen-heading">
        <div className="screen-heading-main">
          <div className="screen-title-icon emergency">
            <Zap size={20} />
          </div>
          <div className="screen-title-copy">
            <p className="app-page-kicker">Active Emergency</p>
            <h2>{job.service_name || job.service_type}</h2>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress">
        {steps.map((step, i) => (
          <span key={step} className={i <= stepIdx ? 'done' : ''}>{step}</span>
        ))}
      </div>

      <div className="detail-grid">
        <article className="panel app-soft-card">
          <MapTracker
            lat={job.customer_lat || job.latitude}
            lng={job.customer_lng || job.longitude}
            label="Customer pin"
            secondaryLat={job.employee_lat || job.tracking_lat}
            secondaryLng={job.employee_lng || job.tracking_lng}
          />
        </article>

        <article className="panel app-soft-card">
          <div className="panel-accent emergency" />
          <div className="panel-body padded-left">
            <h3 className="section-label blue">
              <User size={12} /> Customer
            </h3>
            <p className="item-title">{job.customer_name}</p>
            <p className="meta-line">
              <Phone size={13} /> {job.customer_phone}
            </p>

            <h3 className="section-label purple divider-soft">
              <CreditCard size={12} /> Payment
            </h3>
            <div className="payment-pills">
              <span className="status-pill">{job.payment_method}</span>
              <span className={`status-pill ${job.payment_status === 'paid' ? 'online' : 'pending'}`}>{job.payment_status}</span>
            </div>

            {error && <div className="alert"><AlertTriangle size={15} /> {error}</div>}

            <div className="form-actions vertical app-sticky-action">
              {job.status === 'accepted' && (
                <button className="button green w-full justify-center" onClick={() => updateStatus('arrived')} disabled={Boolean(updating)}>
                  <MapPin size={15} />
                  {updating === 'arrived' ? 'Updating...' : "I've Arrived"}
                </button>
              )}
              <button className="button primary w-full justify-center" onClick={() => updateStatus('completed')} disabled={Boolean(updating)}>
                <CheckCircle2 size={15} />
                {updating === 'completed' ? 'Completing...' : 'Mark as Complete'}
              </button>
              <button className="button danger w-full justify-center" onClick={() => setCancelOpen(true)} disabled={Boolean(updating)}>
                <X size={15} /> Cancel Job
              </button>
            </div>
          </div>
        </article>
      </div>

      {cancelOpen && (
        <div className="modal-backdrop">
          <div className="modal glass-panel">
            <div className="panel-accent danger" />
            <div className="panel-body padded-left">
              <div className="modal-title-row">
                <AlertTriangle size={20} />
                <h3>Cancel Job</h3>
              </div>
              <label className="mb-3">
                <span>Cancellation Reason</span>
                <select value={reason} onChange={(e) => setReason(e.target.value)}>
                  {reasons.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              {reason === 'Other' && (
                <textarea value={otherReason} onChange={(e) => setOtherReason(e.target.value)} placeholder="Describe the reason..." className="mb-3" />
              )}
              <div className="form-actions">
                <button className="button ghost" onClick={() => setCancelOpen(false)}><X size={14} /> Close</button>
                <button className="button danger" onClick={cancel}><AlertTriangle size={14} /> Confirm Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
