import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import api from '../api';
import TrailFinder from '../components/TrailFinder';
import { useAuth } from '../context/AuthContext';

const bgPositions = {
  1: 'center',
  2: 'center 50%',
  3: 'center',
};

function TrailList() {
  const { user } = useAuth();
  const [trails, setTrails] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFinder, setShowFinder] = useState(true);
  const [highlightedId, setHighlightedId] = useState(null);

  useEffect(() => {
    api.get('/trails')
      .then(res => setTrails(res.data))
      .catch(() => setError('Could not load trails'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    api.get('/favorites')
      .then(res => setFavoriteIds(res.data.map(t => t.id)))
      .catch(() => {});
  }, [user]);

  const toggleFavorite = async (e, trailId) => {
    e.preventDefault();
    e.stopPropagation();
    const isFav = favoriteIds.includes(trailId);
    try {
      if (isFav) {
        await api.delete(`/favorites/${trailId}`);
        setFavoriteIds(prev => prev.filter(id => id !== trailId));
      } else {
        await api.post(`/favorites/${trailId}`);
        setFavoriteIds(prev => [...prev, trailId]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecommend = (trailId) => {
    setShowFinder(false);
    setHighlightedId(trailId);
  };

  const handleSkip = () => {
    setShowFinder(false);
  };

  if (loading) return <p style={{ padding: '1.5rem' }}>Loading trails...</p>;
  if (error) return <p style={{ padding: '1.5rem' }}>{error}</p>;

  return (
    <div style={{ padding: '1.5rem' }}>
      {showFinder && (
        <TrailFinder onRecommend={handleRecommend} onSkip={handleSkip} />
      )}

      <h2 style={{ textAlign: 'center', fontSize: '22px', margin: '0 0 4px' }}>
        Choose a trail that fits you
      </h2>
      <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '13px', margin: '0 0 1.5rem' }}>
        From easy family walks to longer historical routes
      </p>

      {highlightedId && (
        <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-lime-dark)', fontWeight: 600, margin: '0 0 1rem' }}>
          Based on your answers, we think this one's a great fit ↓
        </p>
      )}

      {trails.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No trails yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}>
          {trails.map(trail => {
            const isFav = favoriteIds.includes(trail.id);
            return (
              <Link
                key={trail.id}
                to={`/trails/${trail.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  background: 'var(--color-card-bg)',
                  borderRadius: 'var(--radius-card)',
                  boxShadow: trail.id === highlightedId
                    ? '0 0 0 3px var(--color-lime), var(--shadow-card)'
                    : 'var(--shadow-card)',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.3s ease',
                  position: 'relative',
                }}>
                  <div style={{
                    height: '150px',
                    backgroundImage: `url(/images/trails/trail-${trail.id}.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: bgPositions[trail.id] || 'center',
                    position: 'relative',
                  }}>
                    {user && (
                      <button
                        onClick={(e) => toggleFavorite(e, trail.id)}
                        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(255,255,255,0.85)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Heart
                          size={16}
                          color={isFav ? '#E63946' : '#666'}
                          fill={isFav ? '#E63946' : 'none'}
                          strokeWidth={2}
                        />
                      </button>
                    )}
                  </div>
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TrailList;