import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const bgPositions = {
  1: 'center',
  2: 'center 50%',
  3: 'center',
};

function TrailList() {
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/trails')
      .then(res => setTrails(res.data))
      .catch(() => setError('Could not load trails'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: '1.5rem' }}>Loading trails...</p>;
  if (error) return <p style={{ padding: '1.5rem' }}>{error}</p>;

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ textAlign: 'center', fontSize: '22px', margin: '0 0 4px' }}>
        Choose a trail that fits you
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px', margin: '0 0 1.5rem' }}>
        From easy family walks to longer historical routes
      </p>

      {trails.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No trails yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {trails.map(trail => (
            <Link
              key={trail.id}
              to={`/trails/${trail.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                background: 'var(--color-card-bg)',
                borderRadius: 'var(--radius-card)',
                boxShadow: 'var(--shadow-card)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '150px',
                  backgroundImage: `url(/images/trails/trail-${trail.id}.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: bgPositions[trail.id] || 'center',
                }} />
                <div style={{ padding: '14px' }}>
                  <span style={{
                    background: 'var(--color-badge-bg)',
                    color: 'var(--color-badge-text)',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: '12px',
                  }}>
                    {trail.difficulty}
                  </span>
                  <p style={{ fontSize: '16px', margin: '10px 0 4px', fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                    {trail.name}
                  </p>
                  <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
                    {trail.estimated_time} · {trail.water_sources ? 'Water on trail' : trail.shade_level + ' shade'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TrailList;