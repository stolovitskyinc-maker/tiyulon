import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

function TrailList() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/trails')
      .then(res => setTrails(res.data))
      .catch(err => setError('Could not load trails'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading trails...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Tiyulon — Family Trails</h1>
      {trails.length === 0 ? (
        <p>No trails yet.</p>
      ) : (
        <ul>
          {trails.map(trail => (
            <li key={trail.id}>
              <Link to={`/trails/${trail.id}`}>{trail.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TrailList;