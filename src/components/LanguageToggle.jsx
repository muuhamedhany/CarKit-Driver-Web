import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle({ compact = false }) {
  const { locale, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={`Switch language to ${locale === 'en' ? 'Arabic' : 'English'}`}
      title={`Switch language to ${locale === 'en' ? 'Arabic' : 'English'}`}
      className={`theme-toggle ${compact ? 'theme-toggle-compact' : ''}`}
      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
    >
      <Globe size={18} />
      {!compact && <span>{locale === 'en' ? 'العربية' : 'English'}</span>}
      {compact && <span style={{ fontSize: '10px', fontWeight: 800 }}>{locale === 'en' ? 'AR' : 'EN'}</span>}
    </button>
  );
}
