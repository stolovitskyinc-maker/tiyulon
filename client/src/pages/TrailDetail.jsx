import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../api';
import TrailChat from '../components/TrailChat';

function TrailDetail() {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading trail...</p>;
  if (error) return <p>{error}</p>;
  if (!trail) return <p>Trail not found.</p>;

  const center = [trail.map_center_lat || 31.7683, trail.map_center_lng || 35.2137];

  return (
    <div>
      <h1>{trail.name}</h1>
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