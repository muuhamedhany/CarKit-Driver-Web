import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle2, History, MapPin } from 'lucide-react';
import { API_URL, useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
 
export default function DriverHistory() {
  const { headers } = useAuth();
  const { t } = useLanguage();
  const [rows, setRows] = useState([]);
  const [date, setDate] = useState('');
 
  useEffect(() => {
    axios.get(`${API_URL}/deliveries/my-history`, { headers })
      .then((res) => setRows(res.data?.data || []))
      .catch(() => {});
  }, []);
 
  const filtered = useMemo(
    () => rows.filter((row) => !date || String(row.delivered_at || row.order_date).startsWith(date)),
    [rows, date],
  );
 
  return (
    <div className="page-stack">
 
      <div className="screen-heading history-heading">
        <div className="screen-heading-main">
          <div className="screen-title-icon">
            <History size={20} />
          </div>
          <div className="screen-title-copy">
            <h2>{t('Delivery History')}</h2>
          </div>
        </div>
        <span className="status-pill">{filtered.length} {t('total')}</span>
 
      </div>
 
      <div className="table-card app-soft-card">
        {filtered.map((row) => (
          <details key={row.order_id} className="group">
            <summary>
              <div className="summary-row">
                <div className="order-summary">
                  <div className="order-id-badge success">
                    #{row.order_id}
                  </div>
                  <div className="order-copy">
                    <strong>{t('Order #')}{row.order_id}</strong>
                    <p className="compact-meta">
                      <MapPin size={11} style={{ flexShrink: 0 }} />
                      <span>{row.shipping_city || t('Unknown area')}</span>
                    </p>
                  </div>
                </div>
 
                <div className="screen-actions">
                  <span className="status-pill online">{t(row.status)}</span>
                  <CheckCircle2 size={14} className="muted-icon-success" />
                </div>
              </div>
            </summary>
 
            <div className="details-panel">
              <p>
                {new Date(row.delivered_at || row.order_date).toLocaleString()}
              </p>
              {row.proof_photo_url && (
                <img className="proof-thumb" src={row.proof_photo_url} alt={t('Delivery proof')} />
              )}
            </div>
          </details>
        ))}
      </div>
 
      {!filtered.length && (
        <div className="empty-state">
          <div className="empty-state-icon"><History size={32} /></div>
          <p>{t('No completed deliveries')}{date ? t(' for this date') : ''}.</p>
        </div>
      )}
    </div>
  );
}
