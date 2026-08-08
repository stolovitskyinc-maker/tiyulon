import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
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

function TrailDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [trail, setTrail] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

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

  if (loading) return <p>Loading trail...</p>;
  if (error) return <p>{error}</p>;
  if (!trail) return <p>Trail not found.</p>;

  const center = [trail.map_center_lat || 31.7683, trail.map_center_lng || 35.2137];
  const path = trail.path || [];

  return (
    <div>
      <h1>{trail.name}</h1>

      {user && (
        <button onClick={toggleFavorite} disabled={favLoading}>
          {isFavorite ? '★ Favorited' : '☆ Add to Favorites'}
        </button>
      )}

      <p>{trail.description}</p>
      <p>Difficulty: {trail.difficulty} | Shade: {trail.shade_level} | Water: {trail.water_sources ? 'Yes' : 'No'}</p>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', margin: '0.75rem 0', fontSize: '0.9rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ display: 'inline-block', width: '28px', height: '4px', backgroundColor: '#FF8C00', opacity: 0.7 }}></span>
          <span>Main trail</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            display: 'inline-block',
            width: '28px',
            height: '4px',
            backgroundImage: 'repeating-linear-gradient(to right, #8B5CF6 0, #8B5CF6 6px, transparent 6px, transparent 12px)',
          }}></span>
          <span>Extended route (optional, longer)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: '#2ecc71',
            border: '2px solid white',
            boxShadow: '0 0 0 1px #ccc',
          }}></span>
          <span>Trailhead</span>
        </div>
      </div>

      <MapContainer center={center} zoom={14} style={{ height: '400px', width: '100%' }}>
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
          <Marker key={wp.id} position={[wp.lat, wp.lng]}>
            <Popup>
              <strong>{wp.name}</strong>
              <p>{wp.story_text}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <TrailChat trailId={id} />
    </div>
  );
}

export default TrailDetail;