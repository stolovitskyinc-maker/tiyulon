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
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginTop: '1.5rem' }}>
      <h3>Ask the Trail Guide</h3>

      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
        {messages.length === 0 && (
          <p style={{ color: '#888' }}>Ask me anything about this trail's history or details.</p>
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
                background: m.role === 'user' ? '#daf1da' : '#f0f0f0',
                borderRadius: '10px',
                padding: '0.5rem 0.8rem',
                maxWidth: '80%',
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
        {sending && <p style={{ color: '#888' }}>Thinking...</p>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about this trail..."
          style={{ flex: 1, padding: '0.5rem' }}
          disabled={sending}
        />
        <button onClick={sendMessage} disabled={sending}>
          Send
        </button>
      </div>
    </div>
  );
}

export default TrailChat;