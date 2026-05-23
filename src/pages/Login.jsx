import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, BadgeCheck, Eye, EyeOff, KeyRound, Loader2, Mail, ShieldCheck, Truck, Wrench, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [gateway, setGateway] = useState('driver');
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = gateway === 'driver'
        ? { email: form.email, password: form.password }
        : { phone: form.email, email: form.email, password: form.password };
      const result = await login(gateway, payload);
      if (!result.success) {
        setError(result.message || 'Login failed.');
        return;
      }
      navigate(gateway === 'driver' ? '/driver/dashboard' : '/emergency/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const modeAccent = gateway === 'driver' ? 'var(--accent-pink)' : 'var(--accent-blue)';

  return (
    <div className="auth-page" style={{ '--mode-accent': modeAccent }}>
      <div className="auth-grid-overlay" />
      <div className="auth-container animate-fade-in">
        <section className={`auth-card auth-card-${gateway === 'driver' ? 'driver' : 'emergency'} auth-login-card`}>
          <div className="auth-card-heading">
            <div>

              <h2 className="auth-card-title">Sign In</h2>

            </div>
            <div className="auth-card-brand-badge">
              <div className="auth-logo-mark-mini">CK</div>
              <span>CarKit Field Ops</span>
            </div>
          </div>

          <div className="gateway-tabs">
            <button
              type="button"
              className={gateway === 'driver' ? 'active' : ''}
              onClick={() => setGateway('driver')}
            >
              <Truck size={16} /> Delivery Driver
            </button>
            <button
              type="button"
              className={gateway === 'emergency_employee' ? 'active' : ''}
              onClick={() => setGateway('emergency_employee')}
            >
              <Wrench size={16} /> Emergency
            </button>
          </div>

          <form onSubmit={submit} className="auth-form">
            <div>
              <label className="auth-field-label">
                <span>{gateway === 'driver' ? 'Email Address' : 'Phone or Email'}</span>
              </label>
              <div className="auth-input-wrap">
                <Mail size={16} />
                <input
                  type="text"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder={gateway === 'driver' ? 'driver@carkit.io' : 'phone or email'}
                  required
                />
              </div>
            </div>

            <div>
              <label className="auth-field-label">
                <span>Password</span>
              </label>
              <div className="auth-input-wrap">
                <KeyRound size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  className="has-action"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-visibility-button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="alert">
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`auth-submit ${gateway === 'emergency_employee' ? 'emergency-submit' : ''}`}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : (
                <>
                  <Zap size={16} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-assurance-grid">
            <div>
              <ShieldCheck size={16} />
              <span>Encrypted session</span>
            </div>
            <div>
              <BadgeCheck size={16} />
              <span>{gateway === 'driver' ? 'Driver verified' : 'Provider managed'}</span>
            </div>
          </div>

          {gateway === 'driver' ? (
            <div className="auth-link-row">
              <Link to="/signup">Create driver account</Link>
            </div>
          ) : (
            <p className="muted auth-help-text">Emergency employee accounts are created by service providers.</p>
          )}
        </section>
      </div>
    </div>
  );
}
