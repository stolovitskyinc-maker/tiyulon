import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, MessageCircle } from 'lucide-react';
import api from '../api';

function Home() {
  const [trails, setTrails] = useState([]);

  useEffect(() => {
    api.get('/trails')
      .then(res => setTrails(res.data.slice(0, 3)))
      .catch(() => setTrails([]));
  }, []);

  const features = [
    {
      icon: Users,
      title: 'Built for families',
      text: 'Filter by shade, water access, and difficulty — plan a hike that actually works for your day.',
    },
    {
      icon: BookOpen,
      title: 'Stories at every stop',
      text: 'Real history and nature notes tied to specific points along the trail, not generic trivia.',
    },
    {
      icon: MessageCircle,
      title: 'An AI guide who knows the trail',
      text: 'Ask questions as you go — grounded in real trail data, not guesses.',
    },
  ];

  return (
    <div>
      {/* HERO */}
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
              3 curated trails · 29 stories along the way · Judean Desert & Galilee
            </p>
          </div>
        </div>

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

      {/* WHY TIYULON */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 1.5rem 3rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', margin: '0 0 2.5rem' }}>
          Why Tiyulon
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '28px',
        }}>
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'var(--color-badge-bg)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px',
              }}>
                <Icon size={22} color="var(--color-lime-dark)" strokeWidth={2} />
              </div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px', margin: '0 0 6px' }}>
                {title}
              </p>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem 1.5rem 4rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', margin: '0 0 2.5rem' }}>
          How it works
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '28px',
        }}>
          {[
            { step: '1', title: 'Browse trails', text: 'Filter by difficulty, shade, and water to find one that fits your day.' },
            { step: '2', title: 'Follow the map', text: 'See the route, tap waypoints, and uncover the history along the way.' },
            { step: '3', title: 'Ask as you go', text: 'Chat with the trail guide any time you want to know more.' },
          ].map(({ step, title, text }) => (
            <div key={step} style={{ textAlign: 'center' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--color-dark)', color: 'var(--color-lime)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px', fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '15px',
              }}>
                {step}
              </div>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: '15px', margin: '0 0 6px' }}>
                {title}
              </p>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CLOSING CTA */}
      <div style={{
        background: 'var(--color-lime)',
        padding: '3rem 1.5rem',
        textAlign: 'center',
      }}>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '22px', margin: '0 0 10px', color: 'var(--color-dark)' }}>
          Ready for your next hike?
        </p>
        <p style={{ fontSize: '13.5px', color: 'var(--color-dark)', opacity: 0.8, margin: '0 0 20px' }}>
          Create a free account to save your favorite trails.
        </p>
        <Link
          to="/register"
          style={{
            display: 'inline-block',
            background: 'var(--color-dark)',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: 'var(--radius-pill)',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
          }}
        >
          Sign up free
        </Link>
      </div>
    </div>
  );
}

export default Home;