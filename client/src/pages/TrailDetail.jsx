import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../api';

function TrailDetail() {
  const { id } = useParams();
  const [trail, setTrail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/trails/${id}`)
      .then(res => setTrail(res.data))
      .catch(() => setError('Could not load trail'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading trail...</p>;
  if (error) return <p>{error}</p>;
  if (!trail) return <p>Trail not found.</p>;

  const center = [trail.map_center_lat || 31.7683, trail.map_center_lng || 35.2137]; // fallback: Jerusalem

  return (
    <div>
      <h1>{trail.name}</h1>
      <p>{trail.description}</p>
      <p>Difficulty: {trail.difficulty} | Shade: {trail.shade_level} | Water: {trail.water_sources ? 'Yes' : 'No'}</p>

      <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={center}>
          <Popup>{trail.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default TrailDetail;