import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Smartphone, MessageSquare, CheckCircle2, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

const BRIEFING_TEXT = "Good morning Alex and Sarah! Here is your 60-second DayMate update. First: Leo's field trip permission slip has been digitally signed and forwarded to the school portal. Second: We caught a $24 rate hike on your Comcast internet and sent an automated negotiation letter requesting a price match. Third: Your furnace filter is due for replacement, and Sarah's car service is booked for Saturday morning at 9 AM. Have a wonderful, stress-free day!";

export default function MorningBriefing({ onActionCompleted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speechActive, setSpeechActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (speechActive && window.speechSynthesis) {
              window.speechSynthesis.cancel();
              setSpeechActive(false);
            }
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
            if (onActionCompleted) onActionCompleted(0.5, 0);
            return 100;
          }
          return prev + 2;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speechActive, onActionCompleted]);

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
    } else {
      setIsPlaying(true);
      if (progress >= 100) setProgress(0);

      // Web Speech API for real audio playback
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(BRIEFING_TEXT);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        utterance.onend = () => {
          setIsPlaying(false);
          setSpeechActive(false);
          setProgress(100);
        };
        window.speechSynthesis.speak(utterance);
        setSpeechActive(true);
      }
    }
  };

  const handleReset = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>60-Second Daily Audio & WhatsApp Digest</h2>
            <span className="badge badge-purple">Daily Habit</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Listen while making coffee, or read the automated 7:30 AM WhatsApp notification.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handleReset} title="Restart Audio">
            <RotateCcw size={15} />
          </button>
          <button className="btn btn-primary" onClick={togglePlay}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause Voice' : 'Play Voice Briefing (Real Voice)'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Audio Player Card */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Volume2 size={24} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                <span style={{ fontWeight: 600, color: '#e0e7ff' }}>Today's Spoken Admin Digest</span>
                <span>{Math.floor((progress / 100) * 45)}s / 45s</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px', transition: 'width 0.2s linear' }} />
              </div>
            </div>
          </div>

          {/* Transcript Box */}
          <div style={{
            background: 'rgba(0,0,0,0.35)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-glass)',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            color: '#e0e7ff',
            fontStyle: 'italic'
          }}>
            "{BRIEFING_TEXT}"
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} color="#34d399" /> Synthesized dynamically with your browser's natural speech engine.
          </div>
        </div>

        {/* WhatsApp Notification Simulator */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Smartphone size={20} color="#25D366" />
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>WhatsApp Morning Push</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Delivered at 7:30 AM sharp to Alex & Sarah</p>
            </div>
          </div>

          {/* Phone Message Mockup */}
          <div style={{
            background: '#0b141a',
            borderRadius: '14px',
            padding: '14px',
            border: '1px solid rgba(37, 211, 102, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={15} color="black" />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e9edef' }}>DayMate Family Copilot</div>
                <div style={{ fontSize: '0.68rem', color: '#8696a0' }}>Today 7:30 AM</div>
              </div>
            </div>

            <div style={{ background: '#202c33', padding: '12px', borderRadius: '10px', fontSize: '0.84rem', color: '#d1d7db', lineHeight: 1.5 }}>
              ☀️ <strong>Good morning Alex!</strong> Here is your quick household briefing:<br /><br />
              1. 📝 <strong>Leo's Trip Form:</strong> Signed & submitted ($18).<br />
              2. 💰 <strong>Comcast Wi-Fi:</strong> Negotiation sent (targeting $55/mo).<br />
              3. 🚗 <strong>Odyssey Oil Service:</strong> Booked for Sat 9 AM.<br />
              4. 📦 <strong>Furnace Filter:</strong> Arriving tomorrow.<br /><br />
              <span style={{ color: '#53bdeb' }}>Reply "1" to pause tasks or "OK" to dismiss.</span>
            </div>
          </div>

          <button
            className="btn btn-secondary"
            onClick={() => alert('Simulated WhatsApp Test Push dispatched to +1 (555) 019-2834!')}
            style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
          >
            <MessageSquare size={15} color="#25D366" /> Send Test Notification to My Phone
          </button>
        </div>
      </div>
    </div>
  );
}
