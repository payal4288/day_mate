import React from 'react';
import { Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, stats }) {
  return (
    <header style={{ marginBottom: '20px' }}>
      {/* Navbar Card */}
      <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setActiveTab('pitch')}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cpu size={20} color="white" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>DayMate</h1>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>PRO</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Life Admin Copilot for Busy Families</p>
          </div>
        </div>

        {/* Live Counters */}
        <div style={{ display: 'flex', gap: '14px', fontSize: '0.84rem', alignItems: 'center' }}>
          <span style={{ color: '#34d399', fontWeight: 600 }}>⏱️ {stats.hoursSaved} hrs saved</span>
          <span style={{ color: '#818cf8', fontWeight: 600 }}>💰 ${stats.moneySaved} saved</span>
        </div>

        {/* Tabs */}
        <nav style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'pitch', label: '💡 Pitch & Pricing' },
            { id: 'ingest', label: '📥 Ingest (WhatsApp)' },
            { id: 'briefing', label: '🎙️ Voice Digest' },
            { id: 'docs', label: '📄 Form AutoPilot' },
            { id: 'bills', label: '💳 Bill Defense' },
            { id: 'home', label: '🛠️ Home & Car' },
            { id: 'chat', label: '💬 AI Vault' }
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
                fontSize: '0.84rem',
                transition: 'all 0.2s ease'
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
