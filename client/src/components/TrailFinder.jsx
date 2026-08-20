import { useState } from 'react';
import api from '../api';

const QUESTIONS = [
  {
    key: 'region',
    prompt: "Which part of the country interests you more?",
    options: ['Judean Desert', 'Galilee', 'No preference'],
  },
  {
    key: 'difficulty',
    prompt: "How much difficulty are you comfortable with?",
    options: ['Easy', 'Moderate', 'Any'],
  },
  {
    key: 'water',
    prompt: "Do you want water access on the trail?",
    options: ['Yes', 'No', "Doesn't matter"],
  },
  {
    key: 'kids',
    prompt: "Hiking with young kids or a stroller?",
    options: ['Yes', 'No'],
  },
  {
    key: 'time',
    prompt: "How much time do you have to hike today?",
    options: ['Under 1.5 hours', '1.5–2.5 hours', 'More than 2.5 hours'],
  },
  {
    key: 'interest',
    prompt: "More interested in history or nature?",
    options: ['History', 'Nature', 'Both'],
  },
];

function TrailFinder({ onRecommend, onSkip }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: QUESTIONS[0].prompt }
  ]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [finished, setFinished] = useState(false);

  const advance = async (answerText) => {
    const currentQuestion = QUESTIONS[step];
    const updatedAnswers = { ...answers, [currentQuestion.key]: answerText };
    const updatedMessages = [...messages, { role: 'user', content: answerText }];

    setAnswers(updatedAnswers);

    const nextStep = step + 1;
    if (nextStep < QUESTIONS.length) {
      setMessages([...updatedMessages, { role: 'assistant', content: QUESTIONS[nextStep].prompt }]);
      setStep(nextStep);
      setInput('');
    } else {
      setMessages(updatedMessages);
      setFinished(true);
      setInput('');
      setSending(true);

      const summary = `Here's what I'm looking for:
Region: ${updatedAnswers.region}
Difficulty: ${updatedAnswers.difficulty}
Water access: ${updatedAnswers.water}
Hiking with kids/stroller: ${updatedAnswers.kids}
Time available: ${updatedAnswers.time}
Interested in: ${updatedAnswers.interest}
Please recommend the best trail for me.`;

      try {
        const res = await api.post('/recommend', { messages: [{ role: 'user', content: summary }] });
        setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
        if (res.data.recommendedTrailId) {
          setTimeout(() => onRecommend(res.data.recommendedTrailId), 1400);
        }
      } catch (err) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Please try again." }]);
      } finally {
        setSending(false);
      }
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || sending || finished) return;
    advance(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const currentOptions = !finished ? QUESTIONS[step]?.options : null;

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
          Answer a few quick questions and I'll match you with a trail.
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
          {sending && <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Finding your trail...</p>}
        </div>

        {currentOptions && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
            {currentOptions.map(opt => (
              <button
                key={opt}
                onClick={() => advance(opt)}
                disabled={sending}
                style={{
                  background: '#fff',
                  border: '1.5px solid var(--color-lime-dark)',
                  color: 'var(--color-dark)',
                  borderRadius: 'var(--radius-pill)',
                  padding: '6px 14px',
                  fontSize: '12.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '10px' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={finished ? "..." : "Or type your own answer..."}
            style={{
              flex: 1,
              padding: '0.6rem 0.8rem',
              borderRadius: 'var(--radius-pill)',
              border: '1.5px solid #ddd',
              fontSize: '13px',
              outline: 'none',
            }}
            disabled={sending || finished}
          />
          <button
            onClick={handleSend}
            disabled={sending || finished}
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