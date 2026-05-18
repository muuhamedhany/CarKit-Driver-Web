import { ExternalLink, MapPin } from 'lucide-react';

export default function MapTracker({ lat, lng, label = 'Destination', secondaryLat, secondaryLng }) {
  const hasPin = lat !== undefined && lat !== null && lng !== undefined && lng !== null;
  const mapsUrl = hasPin ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}` : '#';

  return (
    <div className="map-card">
      <div className="map-grid">
        <div className="map-pin primary"><MapPin size={22} /></div>
        {secondaryLat && secondaryLng ? <div className="map-pin secondary"><MapPin size={18} /></div> : null}
      </div>
      <div className="map-footer">
        <div>
          <strong>{label}</strong>
          <span>{hasPin ? `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}` : 'No coordinates available'}</span>
        </div>
        <a className={`button small ${hasPin ? '' : 'disabled'}`} href={mapsUrl} target="_blank" rel="noreferrer">
          <ExternalLink size={16} />
          Directions
        </a>
      </div>
    </div>
  );
}
