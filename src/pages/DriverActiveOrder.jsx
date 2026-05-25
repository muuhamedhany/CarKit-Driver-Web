import axios from 'axios';
import { useEffect, useState } from 'react';
import MapTracker from '../components/MapTracker';
import { Camera, CheckCircle2, MapPin, Package, Phone, Upload, User, X } from 'lucide-react';
import { API_URL, useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function DriverActiveOrder() {
  const { headers } = useAuth();
  const { t } = useLanguage();
  const [order, setOrder] = useState(null);
  const [proof, setProof] = useState('');
  const [preview, setPreview] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [completing, setCompleting] = useState(false);

  const load = async () => {
    const res = await axios.get(`${API_URL}/deliveries/my-active`, { headers });
    setOrder(res.data?.data || null);
  };

  useEffect(() => { load(); }, []);

  const pickProof = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setProof(URL.createObjectURL(file));
  };

  const clearProof = () => { setPreview(''); setProof(''); };

  const complete = async () => {
    setCompleting(true);
    await axios.post(`${API_URL}/deliveries/${order.order_id}/complete`, { proof_photo_url: proof, notes }, { headers });
    setMessage(order.is_return ? 'Return delivered successfully!' : 'Order marked as delivered successfully!');
    setOrder(null);
    setCompleting(false);
  };

  if (!order && !message) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Package size={36} /></div>
        <p style={{ fontSize: 'var(--text-base)' }}>{t('No active order right now.')}</p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="success-state panel app-soft-card">
        <div className="success-icon">
          <CheckCircle2 size={30} />
        </div>
        <h1>{t('Delivery Complete')}</h1>
        <div className="banner">{message}</div>
      </div>
    );
  }

  return (
    <div className="page-stack">

      <div className="screen-heading">
        <div className="screen-heading-main">
          <div className="screen-title-icon">
            <Package size={20} />
          </div>
          <div className="screen-title-copy">
            <p className="app-page-kicker">{t(order.is_return ? 'Active Return Delivery' : 'Active Delivery')}</p>
            <h2>{order.is_return ? `${t('Return Order #')}${order.order_id}` : `${t('Order #')}${order.order_id}`}</h2>
          </div>
        </div>
        <div className="progress">
          <span className="done">{t('In Transit')}</span>
          <span>{t('Delivered')}</span>
        </div>
      </div>

      <div className="detail-grid">

        <article className="panel app-soft-card">
          <MapTracker 
            lat={order.is_return ? Number(order.workshop_latitude) : Number(order.shipping_latitude)} 
            lng={order.is_return ? Number(order.workshop_longitude) : Number(order.shipping_longitude)} 
            label={order.is_return ? t('Return To (Vendor Branch)') : t('Customer Details')} 
          />

          <div style={{ marginTop: 16 }}>
            {!preview ? (
              <div className="upload-action-grid">
                <label className="upload-action">
                  <Upload size={15} style={{ color: 'var(--accent-purple)', flexShrink: 0 }} />
                  {t('Upload Proof')}
                  <input type="file" accept="image/*" onChange={pickProof} style={{ display: 'none' }} />
                </label>
                <label className="upload-action info">
                  <Camera size={15} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
                  {t('Take Photo')}
                  <input type="file" accept="image/*" capture="environment" onChange={pickProof} style={{ display: 'none' }} />
                </label>
              </div>
            ) : (
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <img src={preview} alt={t('Proof preview')} className="proof-preview" />
                <button
                  onClick={clearProof}
                  className="floating-clear"
                  aria-label={t('Remove proof photo')}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <textarea
              placeholder={t('Delivery notes (optional)...')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ marginBottom: 12 }}
            />

            <div className="app-sticky-action">
              <button
                className={`button ${order.is_return ? 'purple' : 'primary'}`}
                disabled={!proof || completing}
                onClick={complete}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <CheckCircle2 size={16} />
                {completing ? t('Completing...') : order.is_return ? t('Mark Return Delivered') : t('Mark as Delivered')}
              </button>
            </div>
          </div>
        </article>

        <article className="panel app-soft-card">
          <div className="panel-accent" style={order.is_return ? { backgroundColor: 'var(--accent-purple)' } : {}} />
          <div className="panel-body padded-left">

            {order.is_return ? (
              <>
                <h3 className="section-label purple">
                  <User size={12} /> {t('Pickup From (Customer)')}
                </h3>
                <p className="item-title">{order.customer_name}</p>
                <p className="meta-line">
                  <Phone size={13} style={{ flexShrink: 0 }} /> {order.customer_phone}
                </p>
                <p className="meta-line">
                  <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  {[order.shipping_street, order.shipping_city].filter(Boolean).join(', ')}
                </p>

                <div className="divider-soft" style={{ marginTop: 16, paddingTop: 16 }}>
                  <h3 className="section-label pink">
                    <MapPin size={12} /> {t('Return To (Vendor Branch)')}
                  </h3>
                  <p className="item-title">{order.vendor_name || 'Vendor Branch'}</p>
                  <p className="meta-line" style={{ color: 'var(--text-secondary)' }}>
                    <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                    {order.workshop_address || 'Vendor Branch Address'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <h3 className="section-label purple">
                  <User size={12} /> {t('Customer Details')}
                </h3>
                <p className="item-title">{order.customer_name}</p>
                <p className="meta-line">
                  <Phone size={13} style={{ flexShrink: 0 }} /> {order.customer_phone}
                </p>
                <p className="meta-line">
                  <MapPin size={13} style={{ flexShrink: 0, marginTop: 2 }} />
                  {[order.shipping_street, order.shipping_city].filter(Boolean).join(', ')}
                </p>
              </>
            )}

            <div className="divider-soft">
              <h3 className="section-label blue">
                <Package size={12} /> {t('Order Items')}
              </h3>
              <ul className="item-list compact-list">
                {(order.items || []).map((item) => (
                  <li key={item.order_item_id} style={{ fontSize: 'var(--text-sm)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>{item.quantity}x</span> {item.product_name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
