import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, CheckCircle } from 'lucide-react';
import api from '../api';

function MyTrails() {
  const [favorites, setFavorites] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [view, setView] = useState('favorites');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/favorites'),
      api.get('/completed'),
    ])
      .then(([favRes, compRes]) => {
        setFavorites(favRes.data);
        setCompleted(compRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const list = view === 'favorites' ? favorites : completed;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem 1.5rem 4rem' }}>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', textAlign: 'center', margin: '0 0 1.5rem' }}>
        My Trails
      </h1>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          background: 'var(--color-badge-bg)',
          borderRadius: 'var(--radius-pill)',
          padding: '4px',
        }}>
          <button
            onClick={() => setView('favorites')}
            style={{
              background: view === 'favorites' ? '#fff' : 'transparent',
              boxShadow: view === 'favorites' ? 'var(--shadow-card)' : 'none',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '8px 20px',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-dark)',
            }}
          >
            <Heart size={15} color={view === 'favorites' ? '#E63946' : 'var(--color-text-secondary)'} fill={view === 'favorites' ? '#E63946' : 'none'} />
            Favorites
          </button>
          <button
            onClick={() => setView('completed')}
            style={{
              background: view === 'completed' ? '#fff' : 'transparent',
              boxShadow: view === 'completed' ? 'var(--shadow-card)' : 'none',
              border: 'none',
              borderRadius: 'var(--radius-pill)',
              padding: '8px 20px',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-dark)',
            }}
          >
            <CheckCircle size={15} color={view === 'completed' ? 'var(--color-lime-dark)' : 'var(--color-text-secondary)'} />
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : list.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          {view === 'favorites'
            ? "You haven't favorited any trails yet."
            : "You haven't marked any trails as hiked yet."}
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {list.map(trail => (
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
                  height: '140px',
                  backgroundImage: `url(/images/trails/trail-${trail.id}.png)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
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
                  <p style={{ fontSize: '15px', margin: '10px 0 4px', fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                    {trail.name}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                    {trail.estimated_time}
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

export default MyTrails;