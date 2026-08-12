import { Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'flex-end',
      overflow: 'hidden',
    }}>
      <img
        src="/images/hero-canyon.png"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(22,40,42,0.8), rgba(22,40,42,0.15) 55%, transparent)',
        zIndex: 1,
      }} />

      {/* Floating AI guide preview card */}
      <div className="hero-floating-card" style={{
        position: 'absolute',
        top: '110px',
        right: '5%',
        zIndex: 2,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(6px)',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 8px 30px rgba(22,40,42,0.25)',
        padding: '14px 16px',
        maxWidth: '250px',
        animation: 'fadeSlideUp 0.7s ease-out 0.4s both',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'var(--color-lime)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '14px',
          }}>💬</div>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '12.5px', color: 'var(--color-dark)' }}>
            Trail Guide
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#5C6D6B', margin: 0, lineHeight: 1.5 }}>
          "Why was this fort built here?" — ask any trail, any time.
        </p>
      </div>

      <div style={{
        position: 'relative',
        zIndex: 2,
        padding: '3rem 1.5rem',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <h1 className="hero-title" style={{
          fontSize: '42px',
          color: '#fff',
          margin: '0 0 12px',
          lineHeight: 1.1,
          animation: 'fadeSlideUp 0.7s ease-out both',
        }}>
          Hike smarter,<br />explore further
        </h1>
        <p className="hero-subtitle" style={{
          color: '#fff',
          fontSize: '16px',
          margin: '0 0 22px',
          opacity: 0.95,
          maxWidth: '440px',
          animation: 'fadeSlideUp 0.7s ease-out 0.15s both',
        }}>
          Family trails across Israel, with the stories behind every step — and an AI guide who knows them all.
        </p>

        <div style={{ animation: 'fadeSlideUp 0.7s ease-out 0.3s both' }}>
          <Link
            to="/trails"
            style={{
              display: 'inline-block',
              background: 'var(--color-lime)',
              color: 'var(--color-dark)',
              padding: '13px 30px',
              borderRadius: 'var(--radius-pill)',
              fontWeight: 600,
              fontSize: '14.5px',
              textDecoration: 'none',
            }}
          >
            Explore trails
          </Link>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12.5px', margin: '14px 0 0' }}>
            3 curated trails · Judean Desert & Galilee
          </p>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
        color: '#fff',
        opacity: 0.85,
        animation: 'bounceDown 1.8s ease-in-out infinite',
        fontSize: '20px',
      }}>
        ↓
      </div>
    </div>
  );
}

export default Home;