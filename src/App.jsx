import React, { useState } from 'react';
import Navbar from './components/Navbar';
import NinetiesMusicPlayer from './components/NinetiesMusicPlayer';
import HeroPitch from './components/HeroPitch';
import CaptureHub from './components/CaptureHub';
import DocAutoPilot from './components/DocAutoPilot';
import BillGuardian from './components/BillGuardian';
import HomeMaintenance from './components/HomeMaintenance';
import MorningBriefing from './components/MorningBriefing';
import ChatAssistant from './components/ChatAssistant';

export default function App() {
  const [activeTab, setActiveTab] = useState('pitch');
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

      <NinetiesMusicPlayer />

      <main style={{ minHeight: '600px' }}>
        {activeTab === 'pitch' && (
          <HeroPitch
            onExploreDemo={() => setActiveTab('docs')}
            onSelectTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'ingest' && (
          <CaptureHub onActionCompleted={handleActionCompleted} />
        )}
        {activeTab === 'briefing' && (
          <MorningBriefing onActionCompleted={handleActionCompleted} />
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
        <p>DayMate • AI Copilot for 30–40 Year Old Professionals &amp; Families</p>
        <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
          🔒 256-Bit Encrypted • Private MongoDB Atlas Vector Vault • 100% ROI Guarantee
        </p>
      </footer>
    </div>
  );
}
