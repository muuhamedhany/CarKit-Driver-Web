import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, AlertTriangle, MapPin, RefreshCw, Timer, Wifi, WifiOff, Zap } from 'lucide-react';
import { API_URL, useAuth } from '../contexts/AuthContext';

export default function EmergencyDashboard() {
  const { headers, user, refreshProfile } = useAuth();
  const [feed, setFeed] = useState([]);
  const [active, setActive] = useState(null);
  const [online, setOnline] = useState(Boolean(user?.is_online));
  const [tick, setTick] = useState(Date.now());

  const updateLocation = () => {
    if (!online || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      axios.post(`${API_URL}/emergency/employees/location`, {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }, { headers }).catch(() => {});
    });
  };

  const load = async () => {
    const [feedRes, activeRes] = await Promise.all([
      online ? axios.get(`${API_URL}/emergency/requests/feed`, { headers }) : Promise.resolve({ data: { data: [] } }),
      axios.get(`${API_URL}/emergency/requests/my-active`, { headers }),
    ]);
    setFeed(feedRes.data?.data || []);
    setActive(activeRes.data?.data || null);
  };

  const accept = async (id) => {
    await axios.post(`${API_URL}/emergency/requests/${id}/accept`, {}, { headers });
    await load();
  };

  const toggleOnline = async () => {
    if (online) {
      await axios.post(`${API_URL}/emergency/employees/go-offline`, {}, { headers });
      setOnline(false);
    } else {
      setOnline(true);
      updateLocation();
    }
    refreshProfile();
  };

  useEffect(() => {
    load();
    updateLocation();
    const feedId = setInterval(load, 8000);
    const locId = setInterval(updateLocation, 30000);
    const tickId = setInterval(() => setTick(Date.now()), 1000);
    return () => { clearInterval(feedId); clearInterval(locId); clearInterval(tickId); };
  }, [online]);

  return (
    <div className="page-stack">
      <div className="screen-heading">
        <div className="screen-heading-main">
          
          <div className="screen-title-copy">
            <h2>Incoming Requests</h2>
          </div>
        </div>
        <button
          className={`button ${online ? 'danger' : 'green'}`}
          onClick={toggleOnline}
        >
          {online ? <WifiOff size={15} /> : <Wifi size={15} />}
          {online ? 'Go Offline' : 'Go Online'}
        </button>
      </div>

      <div className={`banner status-banner ${online ? '' : 'warning'}`}>
        <span className={`status-dot ${online ? 'online' : 'pending'}`} />
        <span>
          {online ? 'ONLINE - receiving requests' : 'You are OFFLINE - no requests visible'}
        </span>
      </div>

      {active && (
        <Link className="active-banner" to="/emergency/active">
          <Zap size={18} />
          <span>Active emergency job #{active.request_id} - tap to manage</span>
          <AlertTriangle size={14} className="ml-auto animate-pulse" />
        </Link>
      )}

      {/* Request cards */}
      <div className="card-grid">
        {feed.map((request, i) => {
          const secs = secondsLeft(request.expires_at, tick);
          const urgency = secs < 30 ? 'var(--accent-error)' : secs < 60 ? 'var(--accent-warning)' : 'var(--accent-blue)';
          return (
            <article
              className="card app-soft-card request-card"
              key={request.request_id}
              style={{ animationDelay: `${i * 40}ms`, '--request-color': urgency }}
            >
              <div className="card-header-row">
                <div>
                  <strong className="item-title">{request.service_name || request.service_type}</strong>
                  <p className="compact-meta">Emergency</p>
                </div>
                <div className="request-countdown">
                  <div className="request-timer">
                    <Timer size={13} />
                    <span>{secs}s</span>
                  </div>
                  <div className="request-meter">
                    <div style={{ width: `${Math.min(100, (secs / 120) * 100)}%` }} />
                  </div>
                </div>
              </div>
              <p className="meta-line"><MapPin size={14} style={{ color: 'var(--accent-blue)' }} /> <span>{request.customer_address || 'Address hidden until accepted'}</span></p>
              <button
                className="button primary w-full justify-center"
                onClick={() => accept(request.request_id)}
                disabled={Boolean(active)}
              >
                <Zap size={14} /> Accept Request
              </button>
            </article>
          );
        })}
      </div>
      {!feed.length && (
        <div className="empty-state">
          <div className="empty-state-icon"><RefreshCw size={32} /></div>
          <p>{online ? 'No requests right now. Stay online to receive them.' : 'Go online to start receiving emergency requests.'}</p>
        </div>
      )}
    </div>
  );
}

function secondsLeft(expiresAt, tick) {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - tick) / 1000));
}
