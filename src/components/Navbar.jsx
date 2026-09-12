import React from 'react';
import { Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, stats }) {
  return (
    <header style={{ marginBottom: '20px' }}>
      {/* Navbar Card */}
      <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center'
          }}>
            <Cpu size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>DayMate</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Your AI Copilot for 30–40 Year Olds</p>
          </div>
        </div>

        {/* Live Counters */}
        <div style={{ display: 'flex', gap: '14px', fontSize: '0.84rem' }}>
          <span style={{ color: '#34d399', fontWeight: 600 }}>⏱️ {stats.hoursSaved} hrs saved</span>
          <span style={{ color: '#818cf8', fontWeight: 600 }}>💰 ${stats.moneySaved} saved</span>
        </div>

        {/* Tabs */}
        <nav style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'pitch', label: '💡 Idea' },
            { id: 'briefing', label: '🎙️ Audio' },
            { id: 'docs', label: '📄 Forms' },
            { id: 'bills', label: '💳 Bills' },
            { id: 'home', label: '🛠️ Home' },
            { id: 'chat', label: '💬 Chat' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--primary-gradient)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.84rem'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
