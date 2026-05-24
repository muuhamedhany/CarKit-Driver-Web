import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Clock, MapPin, PackageCheck, RefreshCw, TrendingUp, Truck, Zap } from 'lucide-react';
import { API_URL, useAuth } from '../contexts/AuthContext';

export default function DriverDashboard() {
  const { headers, user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [active, setActive]   = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      total:    history.length,
      today:    history.filter((i) => new Date(i.delivered_at || i.order_date).toDateString() === today).length,
      earnings: history.length * 35,
    };
  }, [history]);

  const load = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    setError('');
    try {
      const [avail, actv, hist] = await Promise.all([
        axios.get(`${API_URL}/deliveries/available`,   { headers }),
        axios.get(`${API_URL}/deliveries/my-active`,   { headers }),
        axios.get(`${API_URL}/deliveries/my-history`,  { headers }),
      ]);
      setOrders(avail.data?.data || []);
      setActive(actv.data?.data  || null);
      setHistory(hist.data?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load dashboard.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const accept = async (orderId) => {
    await axios.post(`${API_URL}/deliveries/${orderId}/accept`, {}, { headers });
    await load();
  };

  useEffect(() => {
    load();
    const id = setInterval(() => load(), 10000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="screen-center">
        <div className="loader-state">
          <div className="app-icon-badge">
            <Truck size={26} />
          </div>
          <p>Loading deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack">
      {error && <div className="alert"><Activity size={15} /> {error}</div>}

      {active && (
        <Link className="active-banner" to="/driver/active">
          <PackageCheck size={18} />
          <span>Active order #{active.order_id} - tap to manage</span>
          <Zap size={14} style={{ marginLeft: 'auto' }} />
        </Link>
      )}

      <div className="screen-heading">
        <div className="screen-heading-main">
          <div className="screen-title-icon">
            <Truck size={20} />
          </div>
          <div className="screen-title-copy">
            <h2>Available Orders</h2>
          </div>
        </div>
        <button className="button small ghost" onClick={() => load(true)}>
          <RefreshCw size={13} style={refreshing ? { animation: 'spin 1s linear infinite' } : {}} />
        </button>
      </div>

      <div className="card-grid">
        {orders.map((order, i) => (
          <article
            key={order.order_id}
            className="card app-soft-card order-card"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="card-header-row">
              <div className="order-summary">
                <div className="order-id-badge" style={order.is_return ? { backgroundColor: 'var(--accent-purple-soft)', color: 'var(--accent-purple)' } : {}}>
                  #{order.order_id}
                </div>
                <div className="order-copy">
                  <strong>{order.is_return ? `Return #${order.order_id}` : `Order #${order.order_id}`}</strong>
                  <p>{order.is_return ? `${order.item_count} items to return` : `${order.item_count} items ready`}</p>
                </div>
              </div>
              <span className={`status-pill ${order.is_return ? 'purple' : ''}`}>{order.item_count} items</span>
            </div>

            <p className="meta-line">
              <MapPin size={13} style={{ color: order.is_return ? 'var(--accent-purple)' : 'var(--accent-pink)', flexShrink: 0 }} />
              <span>
                {order.is_return
                  ? `From: ${order.shipping_city || order.shipping_title || 'Customer'} to ${order.vendor_name || 'Vendor'}`
                  : `To: ${order.shipping_city || order.shipping_title || 'Area unavailable'}`}
              </span>
            </p>
            <p className="meta-line">
              <Clock size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
              {new Date(order.order_date).toLocaleString()}
            </p>

            <button
              className={`button ${order.is_return ? 'purple' : 'primary'}`}
              disabled={Boolean(active)}
              onClick={() => accept(order.order_id)}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <PackageCheck size={15} /> {order.is_return ? 'Accept Return' : 'Accept Order'}
            </button>
          </article>
        ))}
      </div>

      {!orders.length && (
        <div className="empty-state">
          <div className="empty-state-icon"><Truck size={32} /></div>
          <p>No orders available right now. Check back soon.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div
      className="metric-card"
      style={{ '--metric-color': color }}
    >
      <div className="metric-content">
        <div className="metric-icon">
          <Icon size={18} />
        </div>
        <div>
          <span className="metric-label">{label}</span>
          <strong className="metric-value">{value}</strong>
        </div>
      </div>
    </div>
  );
}
