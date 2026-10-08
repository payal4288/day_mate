import React from 'react';
import { Cpu, Plus } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, stats }) {
  return (
    <header style={{ marginBottom: '20px' }}>
      <div className="glass-card" style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => setActiveTab('today')}
        >
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
              <h1 style={{ fontSize: '1.2rem', fontWeight: 800 }}>DayMate</h1>
              <span className="badge badge-purple" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>AI</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Simple Life Admin for Families</p>
          </div>
        </div>

        {/* 5 Clean, Understandable Tabs */}
        <nav style={{
          display: 'flex',
          gap: '4px',
          background: 'rgba(0,0,0,0.3)',
          padding: '4px',
          borderRadius: '10px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'today', label: '🏠 Today' },
            { id: 'docs', label: '📄 Forms' },
            { id: 'bills', label: '💳 Bills' },
            { id: 'home', label: '🛠️ Home' },
            { id: 'chat', label: '💬 Ask AI' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--primary-gradient)' : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                fontSize: '0.86rem',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons & Savings Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '5px 10px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <span style={{ color: '#34d399', fontWeight: 600 }}>⏱️ {stats.hoursSaved}h saved</span>
            <span style={{ color: '#818cf8', fontWeight: 600 }}>💰 ${stats.moneySaved}</span>
          </div>

          <button
            onClick={() => setActiveTab('ingest')}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '6px 12px' }}
          >
            <Plus size={15} /> Add Form or Bill
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            style={{
              background: activeTab === 'pitch' ? 'var(--primary-gradient)' : 'transparent',
              color: activeTab === 'pitch' ? 'white' : 'var(--text-muted)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600
            }}
          >
            💡 Plans & ROI
          </button>
        </div>
      </div>
    </header>
  );
}
