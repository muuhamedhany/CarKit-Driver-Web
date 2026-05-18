import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Clock, Filter, History, MapPin } from 'lucide-react';
import { API_URL, useAuth } from '../contexts/AuthContext';

const STATUS_COLORS = {
  completed: { bg: 'rgba(0,200,83,0.14)', color: 'var(--accent-green)', cls: 'online' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#fca5a5', cls: 'offline' },
  expired:   { bg: 'rgba(217,119,6,0.1)', color: '#fdba74', cls: 'pending' },
};

export default function EmergencyHistory() {
  const { headers, user } = useAuth();
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('all');

  useEffect(() => {
    axios.get(`${API_URL}/emergency/requests/my-history`, { headers })
      .then((res) => setRows(res.data?.data || []))
      .catch(() => setRows([]));
  }, [user?.employee_id]);

  const filtered = useMemo(
    () => rows.filter((row) => status === 'all' || row.status === status),
    [rows, status]
  );

  return (
    <div className="page-stack">
      <div className="screen-heading">
        <div className="screen-heading-main">
          <div className="screen-title-copy">
            <h2>History</h2>
          </div>
        </div>
        <div className="select-inline">
          <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: 'auto', padding: '8px 12px' }}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {user?.cancellation_count > 3 && (
        <div className="banner warning status-banner">
          <AlertTriangle size={15} />
          High cancellation count: <strong>{user.cancellation_count}</strong>. This may affect your eligibility.
        </div>
      )}

      <div className="table-card app-soft-card">
        {filtered.map((row) => {
          const sc = STATUS_COLORS[row.status] || {};
          return (
            <div className="table-row" key={row.request_id}>
              <div className="order-summary">
                <div
                  className="order-id-badge"
                  style={{ background: sc.bg || 'rgba(255,255,255,0.05)', color: sc.color || 'var(--text-secondary)' }}
                >
                  #{row.request_id}
                </div>
                <div className="order-copy">
                  <strong>{row.service_name || row.service_type}</strong>
                  <p className="compact-meta">
                    <MapPin size={11} /> <span>{row.customer_address || '-'}</span>
                  </p>
                </div>
              </div>
              <div className="screen-actions">
                <Clock size={12} style={{ color: 'var(--text-secondary)' }} />
                <span className="compact-date">
                  {new Date(row.created_at || Date.now()).toLocaleDateString()}
                </span>
                <span className={`status-pill ${sc.cls || ''}`}>{row.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {!filtered.length && (
        <div className="empty-state">
          <div className="empty-state-icon"><History size={32} /></div>
          <p>No emergency jobs found for this filter.</p>
        </div>
      )}
    </div>
  );
}
