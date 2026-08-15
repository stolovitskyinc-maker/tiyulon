import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #eee',
      padding: '1.5rem',
      textAlign: 'center',
    }}>
      <Link
        to="/contact"
        style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', textDecoration: 'none' }}
      >
        Contact
      </Link>
      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '8px 0 0' }}>
        © {new Date().getFullYear()} Tiyulon. Built for families exploring Israel's trails.
      </p>
    </footer>
  );
}

export default Footer;