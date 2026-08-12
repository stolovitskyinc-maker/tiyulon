import { Link } from 'react-router-dom';
import { Mountain, Route } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { setAuthToken } from '../api';

function Nav() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setAuthToken(null);
    logout();
  };

  return (
    <nav style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      right: '16px',
      zIndex: 50,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.9rem 1.75rem',
      background: '#fff',
      borderRadius: '999px',
      boxShadow: '0 4px 20px rgba(22,40,42,0.12)',
      maxWidth: '1200px',
      margin: '0 auto',
    }}>
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: '18px',
          textDecoration: 'none',
          color: 'var(--color-dark)',
        }}
      >
        <Mountain size={22} color="var(--color-lime-dark)" strokeWidth={2.2} />
        Tiyulon
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
        <Link
          to="/trails"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            color: 'var(--color-dark)',
            border: '1.5px solid #ddd',
            borderRadius: 'var(--radius-pill)',
            padding: '8px 20px',
            fontSize: '13.5px',
            fontWeight: 500,
          }}
        >
          <Route size={16} color="var(--color-lime-dark)" strokeWidth={2.2} />
          Trails
        </Link>

        {user && (
          <span style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
            Hi, {user.name}
          </span>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          {user ? (
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1.5px solid var(--color-dark)',
                borderRadius: 'var(--radius-pill)',
                padding: '8px 20px',
                fontSize: '13.5px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  textDecoration: 'none',
                  color: 'var(--color-dark)',
                  border: '1.5px solid #ddd',
                  borderRadius: 'var(--radius-pill)',
                  padding: '8px 20px',
                  fontSize: '13.5px',
                  fontWeight: 500,
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  background: 'var(--color-lime)',
                  color: 'var(--color-dark)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '8px 20px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;