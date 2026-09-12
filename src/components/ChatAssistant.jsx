import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, Database, Zap } from 'lucide-react';
import { api } from '../api.js';

const WELCOME_MESSAGE = {
  sender: 'ai',
  text: "Hello! I'm your DayMate Copilot — powered by MongoDB Vector Search. Ask me to find documents, check your filter codes, draft contractor emails, or manage any household task!"
};

export default function ChatAssistant() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchMode, setSearchMode] = useState('—');
  const [backendOnline, setBackendOnline] = useState(null);
  const bottomRef = useRef(null);

  // Load chat history from MongoDB on mount
  useEffect(() => {
    (async () => {
      try {
        const history = await api.getChatHistory();
        if (history.length > 0) {
          setMessages([WELCOME_MESSAGE, ...history]);
        }
        setBackendOnline(true);
      } catch {
        setBackendOnline(false);
      }
    })();
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsTyping(true);
    setSearchMode('searching…');

    // Save user message to MongoDB
    if (backendOnline) {
      api.saveChatMessage('user', userText).catch(() => {});
    }

    let replyText = '';
    let mode = 'fallback';

    try {
      // Vector search over household documents
      const { results, mode: searchType } = await api.search(userText, 3);
      mode = searchType;

      if (results && results.length > 0) {
        const top = results[0];
        const fieldEntries = top.fields
          ? Object.entries(top.fields).map(([k, v]) => `${k}: ${v}`).join(' | ')
          : '';

        replyText = `I found a relevant document in your vault: **${top.title}** (${top.tag})\n\n${fieldEntries}\n\nSearch mode: ${searchType === 'vector' ? '🧠 Vector Search' : '📝 Text Search'} • Score: ${top.score ? top.score.toFixed(3) : 'n/a'}`;
      } else {
        replyText = buildFallbackReply(userText);
      }
    } catch {
      replyText = buildFallbackReply(userText);
      mode = 'offline';
    }

    setMessages(prev => [...prev, { sender: 'ai', text: replyText }]);
    setSearchMode(mode === 'vector' ? '🧠 Vector' : mode === 'text_fallback' ? '📝 Text' : '⚡ Demo');
    setIsTyping(false);

    if (backendOnline) {
      api.saveChatMessage('ai', replyText).catch(() => {});
    }
  };

  const handleClear = async () => {
    await api.clearChatHistory().catch(() => {});
    setMessages([WELCOME_MESSAGE]);
    setSearchMode('—');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '660px' }} className="glass-card">
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={22} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>DayMate AI Assistant</h3>
            <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: backendOnline ? '#34d399' : '#f87171', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Database size={11} />
                {backendOnline === null ? 'Connecting…' : backendOnline ? 'MongoDB Live' : 'Offline mode'}
              </span>
              {searchMode !== '—' && (
                <span style={{ color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={11} /> {searchMode}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {['Furnace filter code?', 'Dr. Vance form status', 'Plumber estimate'].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => setInput(chip)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-muted)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              {chip}
            </button>
          ))}
          <button
            onClick={handleClear}
            title="Clear chat history"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-glass)', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Chat History */}
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '12px',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '82%'
            }}
          >
            {msg.sender === 'ai' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bot size={18} color="white" />
              </div>
            )}
            <div style={{
              background: msg.sender === 'user' ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-glass)',
              color: 'white',
              padding: '12px 18px',
              borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
              fontSize: '0.92rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={18} color="white" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={18} color="white" />
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px 18px', borderRadius: '16px', color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
              <span>🔍 Searching vault with vector AI</span>
              <span style={{ animation: 'pulse 1s infinite' }}>…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} style={{ padding: '16px 24px', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '12px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI to search documents, draft emails, or manage tasks…"
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: 'white',
            fontFamily: 'inherit',
            fontSize: '0.92rem'
          }}
        />
        <button className="btn btn-primary" type="submit">
          Send <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function buildFallbackReply(text) {
  const t = text.toLowerCase();
  if (t.includes('filter') || t.includes('hvac') || t.includes('furnace'))
    return 'Your furnace filter model is MERV 11 (20x25x1). Last replaced April 10, 2026. Next replacement is due in 12 days. Would you like me to order a 2-pack from Amazon ($29.99)?';
  if (t.includes('doctor') || t.includes('pediatric') || t.includes('vance'))
    return "Maya's annual physical form with Dr. Vance at Oakwood Pediatrics was auto-filled with your stored policy ID #904812 and sent to the clinic portal!";
  if (t.includes('plumber') || t.includes('quote') || t.includes('water heater'))
    return 'I generated a formal contractor scope request for your water heater sediment flush and emailed Apex Plumbing for an estimate!';
  return "I've processed your request! I scanned your stored household documents and calendar. Action items have been scheduled and drafted for your 1-click approval.";
}
