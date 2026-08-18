import { useState } from 'react';
import api from '../api';

function TrailFinder({ onRecommend, onSkip }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I can help you find the right trail for today. How much time do you have to hike?" }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const updated = [...messages, { role: 'user', content: trimmed }];
    setMessages(updated);
    setInput('');
    setSending(true);

    try {
      const res = await api.post('/recommend', { messages: updated });
      setMessages([...updated, { role: 'assistant', content: res.data.reply }]);
      if (res.data.recommendedTrailId) {
        setTimeout(() => onRecommend(res.data.recommendedTrailId), 1200);
      }
    } catch (err) {
      setMessages([...updated, { role: 'assistant', content: "Sorry, something went wrong. Please try again." }]);
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
      position: 'fixed',
      inset: 0,
      background: 'rgba(22,40,42,0.55)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        padding: '1.5rem',
        maxWidth: '420px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '80vh',
      }}>
        <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: '17px', margin: '0 0 4px' }}>
          Find your trail
        </h3>
        <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', margin: '0 0 12px' }}>
          Answer a couple quick questions and I'll match you with a trail.
        </p>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '0.75rem', minHeight: '160px' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', margin: '0.5rem 0' }}>
              <span style={{
                display: 'inline-block',
                background: m.role === 'user' ? 'var(--color-lime)' : 'var(--color-badge-bg)',
                color: 'var(--color-dark)',
                borderRadius: '14px',
                padding: '0.5rem 0.8rem',
                maxWidth: '85%',
                fontSize: '13.5px',
                textAlign: 'left',
              }}>
                {m.content}
              </span>
            </div>
          ))}
          {sending && <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Thinking...</p>}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer..."
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

        <button
          onClick={onSkip}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontSize: '12.5px',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Skip, show me all trails
        </button>
      </div>
    </div>
  );
}

export default TrailFinder;