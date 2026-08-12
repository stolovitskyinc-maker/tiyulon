import { useState } from 'react';
import api from '../api';

function TrailChat({ trailId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMessage = { role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);

    try {
      const res = await api.post(`/trails/${trailId}/chat`, { message: trimmed });
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 'var(--radius-card)',
      boxShadow: 'var(--shadow-card)',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '15px', margin: '0 0 10px' }}>Ask the Trail Guide</h3>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '0.75rem' }}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Ask me anything about this trail's history or details.</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === 'user' ? 'right' : 'left',
              margin: '0.5rem 0',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                background: m.role === 'user' ? 'var(--color-lime)' : 'var(--color-badge-bg)',
                color: 'var(--color-dark)',
                borderRadius: '14px',
                padding: '0.5rem 0.8rem',
                maxWidth: '85%',
                fontSize: '13.5px',
                textAlign: 'left',
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
        {sending && <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Thinking...</p>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this trail..."
          style={{
            flex: 1,
            padding: '0.6rem 0.8rem',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid #ddd',
            fontSize: '13px',
            outline: 'none',
          }}
          disabled={sending}
        />
        <button
          onClick={sendMessage}
          disabled={sending}
          style={{
            background: 'var(--color-lime)',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '0.6rem 1.1rem',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default TrailChat;