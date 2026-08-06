import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { setAuthToken } from '../api';

function Nav() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    setAuthToken(null);
    logout();
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <Link to="/" style={{ fontWeight: 'bold' }}>Tiyulon</Link>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '1rem' }}>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;