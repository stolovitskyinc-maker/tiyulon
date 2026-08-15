import { useState } from 'react';
import { Mail } from 'lucide-react';
import api from '../api';

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '26px', textAlign: 'center', margin: '0 0 8px' }}>
        Get in touch
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '14px', margin: '0 0 2rem' }}>
        Questions, feedback, or trail suggestions — I'd love to hear from you.
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '2rem',
        fontSize: '14px',
        color: 'var(--color-dark)',
      }}>
        <Mail size={16} color="var(--color-lime-dark)" />
        <a href="mailto:you@example.com" style={{ color: 'var(--color-dark)', textDecoration: 'none' }}>
          you@example.com
        </a>
      </div>

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
          name="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
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
          name="email"
          type="email"
          placeholder="Your email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid #ddd',
            fontSize: '13.5px',
            outline: 'none',
          }}
        />
        <textarea
          name="message"
          placeholder="Your message"
          value={form.message}
          onChange={handleChange}
          required
          rows={5}
          style={{
            padding: '10px 14px',
            borderRadius: '16px',
            border: '1.5px solid #ddd',
            fontSize: '13.5px',
            outline: 'none',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
        />
        <button
          type="submit"
          disabled={sending}
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
          {sending ? 'Sending...' : 'Send message'}
        </button>

        {status === 'success' && (
          <p style={{ color: '#3B6D11', fontSize: '13px', textAlign: 'center', margin: 0 }}>
            Thanks — your message has been sent!
          </p>
        )}
        {status === 'error' && (
          <p style={{ color: '#B5472B', fontSize: '13px', textAlign: 'center', margin: 0 }}>
            Something went wrong. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}

export default Contact;