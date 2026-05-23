import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle, ArrowLeft, Camera, CheckCircle2,
  IdCard, Loader2, RefreshCcw, Upload, User, X
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '../contexts/AuthContext';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON;
const supabase = (SUPABASE_URL && SUPABASE_ANON) ? createClient(SUPABASE_URL, SUPABASE_ANON) : null;
const BUCKET = 'driver-photos';

function PhotoCapture({ label, sublabel, icon: Icon, value, onChange, aspect = '1/1', required }) {
  const fileRef = useRef(null);
  const cameraRef = useRef(null);
  const [preview, setPreview] = useState(value || null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setErr('');
    setUploading(true);
    if (!supabase) {
      setErr('Supabase is not configured (missing env variables).');
      setUploading(false);
      return;
    }
    const ext = file.name.split('.').pop();
    const path = `signup/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
    if (error) {
      setErr('Upload failed – please try again.');
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onChange(publicUrl);
    setUploading(false);
  };

  const clear = () => { setPreview(null); onChange(''); setErr(''); };

  return (
    <div className="photo-capture">
      <span className="photo-capture-label">
        {label}{required && <span style={{ color: 'var(--accent-pink)', marginLeft: 3 }}>*</span>}
      </span>
      {sublabel && <span className="photo-capture-sublabel">{sublabel}</span>}

      <div
        className={`photo-capture-zone ${preview ? 'has-preview' : ''} ${err ? 'has-error' : ''}`}
        style={{ aspectRatio: aspect }}
        onClick={() => !preview && fileRef.current?.click()}
      >
        {uploading && (
          <div className="photo-capture-loading">
            <Loader2 size={28} className="animate-spin" />
            <span>Uploading...</span>
          </div>
        )}

        {!uploading && !preview && (
          <div className="photo-capture-empty">
            <div className="photo-capture-icon">
              <Icon size={24} />
            </div>
            <span>Tap to upload or use camera</span>
          </div>
        )}

        {!uploading && preview && (
          <>
            <img src={preview} alt={label} className="photo-capture-preview" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clear(); }}
              className="floating-clear"
              aria-label={`Remove ${label}`}
            >
              <X size={14} />
            </button>
          </>
        )}
      </div>

      {err && (
        <span className="photo-capture-error">
          <AlertCircle size={12} /> {err}
        </span>
      )}

      {!preview && !uploading && (
        <div className="photo-capture-actions">
          <button type="button" onClick={() => fileRef.current?.click()} className="photo-action">
            <Upload size={13} /> Upload
          </button>
          <button type="button" onClick={() => cameraRef.current?.click()} className="photo-action info">
            <Camera size={13} /> Camera
          </button>
        </div>
      )}

      {preview && !uploading && (
        <button
          type="button"
          onClick={() => { clear(); fileRef.current?.click(); }}
          className="button ghost photo-capture-change"
        >
          <RefreshCcw size={13} /> Retake / Change
        </button>
      )}

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
}

/* ─────────────────────────────────────────
   Main DriverSignup page
───────────────────────────────────────── */
export default function DriverSignup() {
  const { registerDriver } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    confirm: '',
    vehicle_type: 'motorcycle',
    vehicle_plate: '',
    profile_photo_url: '',
    id_front_url: '',
    id_back_url: '',
  });

  const set = (key) => (value) => setForm({ ...form, [key]: value });
  const setField = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleNext = (e) => {
    if (e) e.preventDefault();
    setError('');
    
    // validate Step 1 fields
    if (!form.full_name.trim()) { setError('Full Name is required.'); return; }
    if (!form.phone.trim()) { setError('Phone Number is required.'); return; }
    if (!form.email.trim()) { setError('Email Address is required.'); return; }
    if (!form.vehicle_plate.trim()) { setError('Vehicle Plate is required.'); return; }
    if (!form.password) { setError('Password is required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }

    setStep(2);
  };

  const handleBackHeader = (e) => {
    if (step === 2) {
      e.preventDefault();
      setStep(1);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    if (step === 1) {
      handleNext(event);
      return;
    }
    setError('');
    if (!form.id_front_url) { setError('Please capture or upload the front of your national ID (بطاقة – وجه أمامي).'); return; }
    if (!form.id_back_url) { setError('Please capture or upload the back of your national ID (بطاقة – الظهر).'); return; }
    setLoading(true);
    try {
      await registerDriver(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-page animate-fade-in">
        <div className="auth-card success-state">
          <div className="success-icon">
            <CheckCircle2 size={30} />
          </div>
          <h1>Account Under Review</h1>
          <p className="muted">
            Your driver account has been created with <strong>pending approval</strong> status.
            An admin must verify your ID before you can accept deliveries.
          </p>
          <Link className="button primary w-full" to="/login">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page signup-page animate-fade-in">
      <div className="auth-container signup-container">
        <header className="auth-topbar">
          <Link to="/login" onClick={handleBackHeader} className="auth-back" aria-label="Back">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1>Create Driver Account</h1>
            <p>Get approved to start accepting deliveries.</p>
          </div>
        </header>

        <section className="auth-card signup-card">
          {/* Progress Indicator */}
          <div className="signup-steps-progress">
            <div className={`step-item ${step === 1 ? 'active' : 'completed'}`}>
              <span className="step-number">{step > 1 ? '✓' : '1'}</span>
              <span className="step-label">Details</span>
            </div>
            <div className="step-divider" />
            <div className={`step-item ${step === 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Photos</span>
            </div>
          </div>

          <form onSubmit={submit} className="signup-form-grid">

            {/* ── STEP 1: ACCOUNT DETAILS ── */}
            {step === 1 && (
              <>
                {/* Left column: personal info */}
                <div className="signup-col">
                  <div className="auth-section">
                    <SectionTitle tone="pink" label="Personal Information" />
                    <div className="form-grid">
                      <Field label="Full Name" value={form.full_name} onChange={setField('full_name')} placeholder="John Doe" required />
                      <Field label="Phone Number" value={form.phone} onChange={setField('phone')} placeholder="+20 xxx xxx xxxx" required />
                      <Field label="Email Address" type="email" value={form.email} onChange={setField('email')} placeholder="driver@carkit.io" required />
                      <Field label="Vehicle Plate" value={form.vehicle_plate} onChange={setField('vehicle_plate')} placeholder="ABC-1234" required />
                    </div>
                  </div>
                </div>

                {/* Right column: security & vehicle */}
                <div className="signup-col">
                  <div className="auth-section">
                    <SectionTitle tone="purple" label="Security" />
                    <div className="form-grid">
                      <Field label="Password" type="password" value={form.password} onChange={setField('password')} placeholder="Min. 8 characters" required />
                      <Field label="Confirm Password" type="password" value={form.confirm} onChange={setField('confirm')} placeholder="Repeat password" required />
                    </div>
                  </div>

                  <div className="auth-section">
                    <SectionTitle tone="warning" label="Vehicle Details" />
                    <div className="form-grid">
                      <label>
                        <span>Vehicle Type</span>
                        <select value={form.vehicle_type} onChange={setField('vehicle_type')}>
                          <option value="motorcycle">Motorcycle</option>
                          <option value="car">Car</option>
                          <option value="van">Van</option>
                          <option value="truck">Truck</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Step 1 Actions */}
                <div className="signup-submit-row">
                  {error && (
                    <div className="alert">
                      <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
                    </div>
                  )}
                  <div className="auth-submit-dock">
                    <button type="submit" className="auth-submit">
                      <span>Next Step</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 2: VERIFICATION PHOTOS ── */}
            {step === 2 && (
              <>
                {/* Left column: profile photo */}
                <div className="signup-col">
                  <div className="auth-section">
                    <SectionTitle tone="purple" label="Profile Photo" />
                    <div className="profile-photo-block">
                      <PhotoCapture
                        label="Profile Picture"
                        sublabel="Clear face photo - optional but recommended"
                        icon={User}
                        value={form.profile_photo_url}
                        onChange={set('profile_photo_url')}
                        aspect="1/1"
                      />
                    </div>
                  </div>
                </div>

                {/* Right column: IDs */}
                <div className="signup-col">
                  <div className="auth-section">
                    <SectionTitle tone="blue" label="National ID • بطاقة الهوية" />
                    <div className="id-photo-grid">
                      <PhotoCapture
                        label="Front Side • الوجه الأمامي"
                        sublabel="Photo of the front of your National ID"
                        icon={IdCard}
                        value={form.id_front_url}
                        onChange={set('id_front_url')}
                        aspect="16/10"
                        required
                      />
                      <PhotoCapture
                        label="Back Side • الظهر"
                        sublabel="Photo of the back of your National ID"
                        icon={IdCard}
                        value={form.id_back_url}
                        onChange={set('id_back_url')}
                        aspect="16/10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Step 2 Actions */}
                <div className="signup-submit-row">
                  {error && (
                    <div className="alert">
                      <AlertCircle size={15} style={{ flexShrink: 0 }} /> {error}
                    </div>
                  )}
                  <div className="auth-submit-dock">
                    <button type="button" onClick={() => setStep(1)} className="button ghost auth-back-btn">
                      <span>Back</span>
                    </button>
                    <button type="submit" disabled={loading} className="auth-submit">
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      {loading ? 'Submitting...' : 'Submit for Approval'}
                    </button>
                  </div>
                </div>
              </>
            )}

          </form>
        </section>
      </div>
    </div>
  );
}

/* ── helpers ── */
function SectionTitle({ label, tone = 'pink' }) {
  return (
    <h3 className={`auth-section-title ${tone}`}>
      {label}
    </h3>
  );
}

function Field({ label, value, onChange, type = 'text', placeholder, required }) {
  return (
    <label>
      <span>{label}</span>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </label>
  );
}
