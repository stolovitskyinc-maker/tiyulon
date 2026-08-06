import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../api';
import TrailChat from '../components/TrailChat';
import { useAuth } from '../context/AuthContext';

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

      <MapContainer center={center} zoom={14} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
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