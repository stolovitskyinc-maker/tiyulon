import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #eee',
      padding: '1.5rem',
      textAlign: 'center',
    }}>
      <Link
        to="/Contact us"
        style={{
          display: 'inline-block',
          textDecoration: 'none',
          color: 'var(--color-dark)',
          border: '1.5px solid #ddd',
          borderRadius: 'var(--radius-pill)',
          padding: '8px 20px',
          fontSize: '13px',
          fontWeight: 500,
          marginBottom: '10px',
        }}
      >
        Contact us
      </Link>
      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
        © {new Date().getFullYear()} Tiyulon. Built for families exploring Israel's trails.
      </p>
    </footer>
  );
}

export default Footer;

