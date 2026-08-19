import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Gauge, TreePine, Droplet, Heart, CheckCircle, Navigation } from 'lucide-react';
import api from '../api';
import TrailChat from '../components/TrailChat';
import { useAuth } from '../context/AuthContext';

const startIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const waypointIcon = new L.Icon({
  iconUrl: '/images/icons/waypoint-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function TrailDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [trail, setTrail] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);

  useEffect(() => {
    api.get(`/trails/${id}`)
      .then(res => setTrail(res.data))
      .catch(err => {
        if (err.response && err.response.status === 404) {
          setError('Trail not found');
        } else {
          setError('Could not load trail');
        }
      })
      .finally(() => setLoading(false));

    api.get(`/trails/${id}/waypoints`)
      .then(res => setWaypoints(res.data))
      .catch(() => setWaypoints([]));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    api.get('/favorites')
      .then(res => {
        const favIds = res.data.map(t => t.id);
        setIsFavorite(favIds.includes(Number(id)));
      })
      .catch(() => {});
  }, [id, user]);

  useEffect(() => {
    if (!user) return;
    api.get('/completed')
      .then(res => {
        const completedIds = res.data.map(t => t.id);
        setIsCompleted(completedIds.includes(Number(id)));
      })
      .catch(() => {});
  }, [id, user]);

  const toggleFavorite = async () => {
    setFavLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  const toggleCompleted = async () => {
    setCompleteLoading(true);
    try {
      if (isCompleted) {
        await api.delete(`/completed/${id}`);
        setIsCompleted(false);
      } else {
        await api.post(`/completed/${id}`);
        setIsCompleted(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompleteLoading(false);
    }
  };

  if (loading) return <p style={{ padding: '1.5rem', textAlign: 'center' }}>Loading trail...</p>;
  if (error) return <p style={{ padding: '1.5rem', textAlign: 'center' }}>{error}</p>;
  if (!trail) return <p style={{ padding: '1.5rem', textAlign: 'center' }}>Trail not found.</p>;

  const center = [trail.map_center_lat || 31.7683, trail.map_center_lng || 35.2137];
  const path = trail.path || [];

  const pillStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '1.5rem',
    background: '#fff',
    border: '1px solid #eee',
    borderRadius: 'var(--radius-pill)',
    padding: '0.6rem 1.5rem',
    boxShadow: 'var(--shadow-card)',
    flexWrap: 'wrap',
    justifyContent: 'center',
  };

  const infoItem = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' };

  return (
    <div style={{ padding: '0 1.5rem 2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', margin: '0 0 8px' }}>{trail.name}</h1>

        {user && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
            <button
              onClick={toggleFavorite}
              disabled={favLoading}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', display: 'inline-flex' }}
            >
              <Heart size={26} color={isFavorite ? '#E63946' : '#999'} fill={isFavorite ? '#E63946' : 'none'} strokeWidth={1.8} />
            </button>

            <button
              onClick={toggleCompleted}
              disabled={completeLoading}
              style={{
                background: isCompleted ? 'var(--color-lime)' : 'transparent',
                border: '1.5px solid var(--color-dark)',
                borderRadius: 'var(--radius-pill)',
                padding: '6px 16px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <CheckCircle size={15} />
              {isCompleted ? 'Hiked' : 'Mark as hiked'}
            </button>
          </div>
        )}

        
          href={`https://www.google.com/maps/dir/?api=1&destination=${center[0]},${center[1]}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            color: 'var(--color-dark)',
            border: '1.5px solid #ddd',
            borderRadius: 'var(--radius-pill)',
            padding: '6px 16px',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '12px',
          }}
        >
          <Navigation size={14} color="var(--color-lime-dark)" />
          Get directions
        </a>

        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 1rem' }}>
          {trail.description}
        </p>

        <div style={{ marginBottom: '10px' }}>
          <div style={pillStyle}>
            <span style={infoItem}><Gauge size={15} color="var(--color-lime-dark)" /> {trail.difficulty}</span>
            <span style={infoItem}><TreePine size={15} color="var(--color-lime-dark)" /> {trail.shade_level} shade</span>
            <span style={infoItem}><Droplet size={15} color="var(--color-lime-dark)" /> {trail.water_sources ? 'Water on trail' : 'No water'}</span>
          </div>
        </div>

        <div>
          <div style={pillStyle}>
            <span style={infoItem}>
              <span style={{ width: '20px', height: '3px', background: '#FF8C00', opacity: 0.7, borderRadius: '2px' }}></span>
              Main trail
            </span>
            <span style={infoItem}>
              <span style={{
                width: '20px', height: '3px', borderRadius: '2px',
                backgroundImage: 'repeating-linear-gradient(to right, #8B5CF6 0, #8B5CF6 5px, transparent 5px, transparent 10px)',
              }}></span>
              Extended route (optional, longer)
            </span>
            <span style={infoItem}>
              <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#2ecc71', border: '2px solid white', boxShadow: '0 0 0 1px #ccc' }}></span>
              Trailhead
            </span>
          </div>
        </div>
      </div>

      <div className="trail-map-wrapper" style={{
        position: 'relative',
        marginTop: '1.5rem',
        borderRadius: 'var(--radius-card)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}>
        <MapContainer className="trail-map-container" center={center} zoom={14} style={{ height: '520px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {path.length > 1 && (
            <Polyline positions={path} pathOptions={{ color: '#FF8C00', weight: 4, opacity: 0.5 }} />
          )}

          {trail.extra_path && trail.extra_path.length > 1 && (
            <Polyline
              positions={trail.extra_path}
              pathOptions={{ color: '#8B5CF6', weight: 4, opacity: 0.6, dashArray: '8, 8' }}
            />
          )}

          {path.length > 0 && (
            <Marker position={path[0]} icon={startIcon}>
              <Popup><strong>Trailhead</strong> — start here</Popup>
            </Marker>
          )}

          {waypoints.map(wp => (
            <Marker key={wp.id} position={[wp.lat, wp.lng]} icon={waypointIcon}>
              <Popup>
                <strong>{wp.name}</strong>
                <p>{wp.story_text}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="trail-chat-panel" style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          bottom: '16px',
          width: '320px',
          zIndex: 400,
        }}>
          <TrailChat trailId={id} />
        </div>
      </div>
    </div>
  );
}

export default TrailDetail;