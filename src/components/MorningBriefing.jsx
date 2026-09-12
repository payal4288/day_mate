import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause } from 'lucide-react';

export default function MorningBriefing({ onActionCompleted }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (onActionCompleted) onActionCompleted(0.5, 0);
            return 100;
          }
          return prev + 4;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onActionCompleted]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>60-Second Daily Update</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Listen while sipping morning coffee.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'Pause' : 'Play Audio (60s)'}
        </button>
      </div>

      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <Volume2 size={24} color="#818cf8" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>Today's Short Audio Summary</span>
              <span>{Math.floor((progress / 100) * 60)}s / 60s</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '3px' }} />
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', color: '#e0e7ff' }}>
          "Good morning! Today: 1) School trip form signed. 2) Internet bill discount email sent. 3) Oil change scheduled for Saturday at 9 AM. Have a good day!"
        </div>
      </div>
    </div>
  );
}
