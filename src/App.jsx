import React, { useState } from 'react';
import Navbar from './components/Navbar';
import TodayDashboard from './components/TodayDashboard';
import NinetiesMusicPlayer from './components/NinetiesMusicPlayer';
import HeroPitch from './components/HeroPitch';
import CaptureHub from './components/CaptureHub';
import DocAutoPilot from './components/DocAutoPilot';
import BillGuardian from './components/BillGuardian';
import HomeMaintenance from './components/HomeMaintenance';
import MorningBriefing from './components/MorningBriefing';
import ChatAssistant from './components/ChatAssistant';
import { Music2, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('today');
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [stats, setStats] = useState({
    hoursSaved: 8.5,
    moneySaved: 349.00
  });

  const handleActionCompleted = (addHours = 0.5, addMoney = 0) => {
    setStats(prev => ({
      hoursSaved: +(prev.hoursSaved + addHours).toFixed(1),
      moneySaved: +(prev.moneySaved + addMoney).toFixed(2)
    }));
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      {/* Discrete, Collapsible Focus Sound Pill */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
        <button
          onClick={() => setShowMusicPlayer(!showMusicPlayer)}
          style={{
            background: showMusicPlayer ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-glass)',
            color: showMusicPlayer ? '#a78bfa' : 'var(--text-muted)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.76rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Music2 size={13} />
          <span>{showMusicPlayer ? 'Hide Focus Melody' : '🎵 Optional Focus Melody'}</span>
          {showMusicPlayer ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {showMusicPlayer && (
        <div style={{ marginBottom: '20px' }}>
          <NinetiesMusicPlayer />
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ minHeight: '600px' }}>
        {activeTab === 'today' && (
          <TodayDashboard
            onActionCompleted={handleActionCompleted}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'docs' && (
          <DocAutoPilot onActionCompleted={handleActionCompleted} />
        )}
        {activeTab === 'bills' && (
          <BillGuardian onActionCompleted={handleActionCompleted} />
        )}
        {activeTab === 'home' && (
          <HomeMaintenance onActionCompleted={handleActionCompleted} />
        )}
        {activeTab === 'chat' && (
          <ChatAssistant />
        )}
        {activeTab === 'ingest' && (
          <CaptureHub onActionCompleted={handleActionCompleted} />
        )}
        {activeTab === 'pitch' && (
          <HeroPitch
            onExploreDemo={() => setActiveTab('today')}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'briefing' && (
          <MorningBriefing onActionCompleted={handleActionCompleted} />
        )}
      </main>

      <footer style={{
        marginTop: '60px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-glass)',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.84rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <p>DayMate • Simple Life Admin for 30–40 Year Old Families</p>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          🔒 256-Bit Encrypted • Private MongoDB Atlas Vault • Zero Model Training on Private Records
        </p>
      </footer>
    </div>
  );
}
