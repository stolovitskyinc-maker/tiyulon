import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { setAuthToken } from '../api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuthToken(res.data.token);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', textAlign: 'center', margin: '0 0 8px' }}>
        Welcome back
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '14px', margin: '0 0 2rem' }}>
        Log in to save and revisit your favorite trails.
      </p>

      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid #ddd',
            fontSize: '13.5px',
            outline: 'none',
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid #ddd',
            fontSize: '13.5px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: 'var(--color-lime)',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '11px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && (
          <p style={{ color: '#B5472B', fontSize: '13px', textAlign: 'center', margin: 0 }}>
            {error}
          </p>
        )}
      </form>

      <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '1.25rem' }}>
        No account?{' '}
        <Link to="/register" style={{ color: 'var(--color-lime-dark)', fontWeight: 600, textDecoration: 'none' }}>
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default Login;