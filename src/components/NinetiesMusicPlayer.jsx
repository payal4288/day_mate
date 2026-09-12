import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Radio, Volume2, VolumeX, Play, Pause } from 'lucide-react';

// ==========================================
// SRK 90s Bollywood Melody Definitions
// Note frequencies in Hz
// ==========================================
const NOTE = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
  A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
  F5: 698.46, G5: 783.99, A5: 880.00, Bb4: 466.16, Ab4: 415.30,
  Eb4: 311.13, Db4: 277.18, Gb4: 369.99, Fs4: 369.99, Bb3: 233.08,
  G3: 196.00, A3: 220.00, F3: 174.61, E3: 164.81, D3: 146.83,
  REST: 0
};

const TRACKS = [
  {
    id: 'chaiyya',
    name: 'Chaiyya Chaiyya – Dil Se (1998)',
    film: 'Dil Se',
    bpm: 120,
    // Melody line (simplified iconic riff)
    melody: [
      [NOTE.E4, 0.25], [NOTE.G4, 0.25], [NOTE.A4, 0.5],
      [NOTE.G4, 0.25], [NOTE.E4, 0.25], [NOTE.D4, 0.5],
      [NOTE.E4, 0.25], [NOTE.G4, 0.25], [NOTE.A4, 0.5],
      [NOTE.C5, 0.25], [NOTE.A4, 0.25], [NOTE.G4, 0.5],
      [NOTE.E4, 0.25], [NOTE.G4, 0.25], [NOTE.A4, 0.25], [NOTE.G4, 0.5],
      [NOTE.E4, 0.25], [NOTE.D4, 0.25], [NOTE.E4, 0.5],
      [NOTE.A3, 1.0],
    ],
    // Chord progression (Am - F - C - G)
    chords: [
      [[NOTE.A3, NOTE.C4, NOTE.E4], 1],
      [[NOTE.F3, NOTE.A3, NOTE.C4], 1],
      [[NOTE.C4, NOTE.E4, NOTE.G4], 1],
      [[NOTE.G3, NOTE.B4 / 2, NOTE.D4], 1],
    ]
  },
  {
    id: 'kkha',
    name: 'Kuch Kuch Hota Hai (1998)',
    film: 'Kuch Kuch Hota Hai',
    bpm: 100,
    melody: [
      [NOTE.G4, 0.5], [NOTE.A4, 0.5],
      [NOTE.C5, 0.75], [NOTE.A4, 0.25],
      [NOTE.G4, 0.5], [NOTE.F4, 0.5],
      [NOTE.E4, 1.0],
      [NOTE.G4, 0.5], [NOTE.A4, 0.5],
      [NOTE.C5, 0.5], [NOTE.D5, 0.5],
      [NOTE.E5, 0.75], [NOTE.D5, 0.25],
      [NOTE.C5, 1.0],
      [NOTE.A4, 0.5], [NOTE.G4, 0.5],
      [NOTE.A4, 1.0],
    ],
    chords: [
      [[NOTE.C4, NOTE.E4, NOTE.G4], 2],
      [[NOTE.F3, NOTE.A3, NOTE.C4], 2],
      [[NOTE.G3, NOTE.B4 / 2, NOTE.D4], 2],
      [[NOTE.C4, NOTE.E4, NOTE.G4], 2],
    ]
  },
  {
    id: 'ddlj',
    name: 'Tujhe Dekha To – DDLJ (1995)',
    film: 'Dilwale Dulhania Le Jayenge',
    bpm: 80,
    melody: [
      [NOTE.E4, 0.5], [NOTE.F4, 0.5],
      [NOTE.G4, 1.0],
      [NOTE.F4, 0.5], [NOTE.E4, 0.5],
      [NOTE.D4, 1.0],
      [NOTE.E4, 0.5], [NOTE.F4, 0.5],
      [NOTE.G4, 0.5], [NOTE.A4, 0.5],
      [NOTE.G4, 1.0],
      [NOTE.C5, 0.5], [NOTE.A4, 0.5],
      [NOTE.G4, 0.5], [NOTE.F4, 0.5],
      [NOTE.E4, 1.5],
    ],
    chords: [
      [[NOTE.C4, NOTE.E4, NOTE.G4], 2],
      [[NOTE.D4, NOTE.F4, NOTE.A4], 2],
      [[NOTE.F3, NOTE.A3, NOTE.C4], 2],
      [[NOTE.G3, NOTE.D4, NOTE.G4], 2],
    ]
  }
];

// ==========================================
// Web Audio helpers
// ==========================================
function createSynthNote(ctx, gainNode, freq, startTime, duration, type = 'sine', vol = 0.15) {
  if (freq === 0) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.02);
  gain.gain.setValueAtTime(vol, startTime + duration * 0.7);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gain);
  gain.connect(gainNode);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

function createKick(ctx, gainNode, startTime) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(150, startTime);
  osc.frequency.exponentialRampToValueAtTime(0.01, startTime + 0.15);
  gain.gain.setValueAtTime(0.6, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
  osc.connect(gain);
  gain.connect(gainNode);
  osc.start(startTime);
  osc.stop(startTime + 0.15);
}

function createSnare(ctx, gainNode, startTime) {
  const bufferSize = Math.floor(ctx.sampleRate * 0.12);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(gainNode);
  noise.start(startTime);
  noise.stop(startTime + 0.12);
}

function createHiHat(ctx, gainNode, startTime) {
  const bufferSize = Math.floor(ctx.sampleRate * 0.05);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 8000;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.15, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(gainNode);
  noise.start(startTime);
  noise.stop(startTime + 0.05);
}

// ==========================================
// Main Component
// ==========================================
export default function NinetiesMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [eqBars] = useState([0.9, 0.5, 0.75, 0.4, 0.85, 0.6]);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const schedulerRef = useRef(null);
  const nextNoteRef = useRef(0);
  const melodyIdxRef = useRef(0);
  const chordIdxRef = useRef(0);
  const chordTimeRef = useRef(0);
  const beatStepRef = useRef(0);
  const beatTimeRef = useRef(0);

  const LOOK_AHEAD = 0.1;
  const SCHEDULE_INTERVAL = 50;

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      gainNodeRef.current = audioCtxRef.current.createGain();
      gainNodeRef.current.gain.value = 0.5;
      gainNodeRef.current.connect(audioCtxRef.current.destination);
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : 0.5;
    }
  }, [isMuted]);

  const stopScheduler = useCallback(() => {
    if (schedulerRef.current) {
      clearInterval(schedulerRef.current);
      schedulerRef.current = null;
    }
  }, []);

  const startScheduler = useCallback((track) => {
    const ctx = getCtx();
    const beatLen = 60 / track.bpm; // seconds per beat

    nextNoteRef.current = ctx.currentTime + 0.1;
    melodyIdxRef.current = 0;
    chordIdxRef.current = 0;
    chordTimeRef.current = ctx.currentTime + 0.1;
    beatStepRef.current = 0;
    beatTimeRef.current = ctx.currentTime + 0.1;

    const schedule = () => {
      const now = ctx.currentTime;

      // Schedule melody notes
      while (nextNoteRef.current < now + LOOK_AHEAD) {
        const [freq, dur] = track.melody[melodyIdxRef.current % track.melody.length];
        const noteDur = dur * beatLen;
        createSynthNote(ctx, gainNodeRef.current, freq, nextNoteRef.current, noteDur, 'triangle', 0.2);
        nextNoteRef.current += noteDur;
        melodyIdxRef.current++;
      }

      // Schedule chords
      while (chordTimeRef.current < now + LOOK_AHEAD) {
        const [freqs, beats] = track.chords[chordIdxRef.current % track.chords.length];
        const chordDur = beats * beatLen;
        freqs.forEach(f => createSynthNote(ctx, gainNodeRef.current, f, chordTimeRef.current, chordDur, 'sawtooth', 0.04));
        chordTimeRef.current += chordDur;
        chordIdxRef.current++;
      }

      // Schedule drums
      while (beatTimeRef.current < now + LOOK_AHEAD) {
        const step = beatStepRef.current % 8;
        const t = beatTimeRef.current;
        if (step === 0 || step === 4) createKick(ctx, gainNodeRef.current, t);
        if (step === 2 || step === 6) createSnare(ctx, gainNodeRef.current, t);
        createHiHat(ctx, gainNodeRef.current, t);
        beatTimeRef.current += beatLen / 2;
        beatStepRef.current++;
      }
    };

    schedule();
    schedulerRef.current = setInterval(schedule, SCHEDULE_INTERVAL);
  }, [getCtx]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopScheduler();
      setIsPlaying(false);
    } else {
      setHasStarted(true);
      startScheduler(currentTrack);
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack, startScheduler, stopScheduler]);

  const switchTrack = useCallback((track) => {
    setCurrentTrack(track);
    if (isPlaying) {
      stopScheduler();
      setTimeout(() => startScheduler(track), 50);
    }
  }, [isPlaying, startScheduler, stopScheduler]);

  // Auto-start on first user interaction with the whole page
  useEffect(() => {
    const handleFirstClick = () => {
      if (!hasStarted) {
        setHasStarted(true);
        getCtx();
        startScheduler(currentTrack);
        setIsPlaying(true);
      }
    };
    window.addEventListener('click', handleFirstClick, { once: true });
    return () => {
      window.removeEventListener('click', handleFirstClick);
      stopScheduler();
    };
  }, [hasStarted, currentTrack, getCtx, startScheduler, stopScheduler]);

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(236,72,153,0.18) 0%, rgba(99,102,241,0.22) 50%, rgba(245,158,11,0.12) 100%)',
      border: '1px solid rgba(236,72,153,0.5)',
      borderRadius: '16px',
      padding: '14px 22px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '14px',
      boxShadow: '0 8px 32px rgba(236,72,153,0.2), 0 2px 8px rgba(0,0,0,0.3)',
      backdropFilter: 'blur(12px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative shimmer */}
      <div style={{
        position: 'absolute', top: 0, left: '-40%', width: '30%', height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)',
        animation: isPlaying ? 'shimmer 2.5s infinite' : 'none',
        pointerEvents: 'none'
      }} />

      {/* Left: Badge + Track info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)',
          color: 'white',
          padding: '9px 14px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 800,
          fontSize: '0.8rem',
          letterSpacing: '0.5px',
          flexShrink: 0
        }}>
          <Radio size={16} style={{ animation: isPlaying ? 'spin 3s linear infinite' : 'none' }} />
          🎬 SRK 90s
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>
              {currentTrack.name}
            </span>
            <span style={{
              background: 'rgba(245,158,11,0.2)', border: '1px solid rgba(245,158,11,0.5)',
              color: '#fbbf24', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '20px'
            }}>
              {currentTrack.bpm} BPM
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            🎥 {currentTrack.film} &nbsp;•&nbsp; {isPlaying ? '🎵 Now Playing via Web Synth' : '▶ Click Play to vibe with SRK!'}
          </p>
        </div>
      </div>

      {/* Right: Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>

        {/* Track Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TRACKS.map(t => (
            <button
              key={t.id}
              onClick={() => switchTrack(t)}
              style={{
                background: currentTrack.id === t.id
                  ? 'linear-gradient(135deg, #ec4899, #8b5cf6)'
                  : 'rgba(255,255,255,0.07)',
                border: currentTrack.id === t.id
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                padding: '5px 12px',
                borderRadius: '20px',
                fontSize: '0.76rem',
                fontWeight: currentTrack.id === t.id ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {t.id === 'chaiyya' ? '🔥 Chaiyya' : t.id === 'kkha' ? '💕 Kuch Kuch' : '🌹 DDLJ'}
            </button>
          ))}
        </div>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          style={{
            background: isPlaying
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            color: 'white',
            padding: '8px 18px',
            borderRadius: '22px',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            boxShadow: isPlaying
              ? '0 4px 14px rgba(239,68,68,0.4)'
              : '0 4px 14px rgba(16,185,129,0.4)',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        {/* Mute */}
        <button
          onClick={() => setIsMuted(m => !m)}
          title={isMuted ? 'Unmute' : 'Mute'}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: isMuted ? '#f87171' : 'white',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>

        {/* EQ Bars Visualizer */}
        {isPlaying && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '22px' }}>
            {eqBars.map((h, i) => (
              <div key={i} style={{
                width: '4px',
                background: `hsl(${300 + i * 20}, 90%, 65%)`,
                borderRadius: '2px',
                height: `${h * 100}%`,
                animation: `eq${i % 3} ${0.3 + i * 0.1}s infinite alternate`
              }} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { left: -40%; }
          100% { left: 140%; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes eq0 { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }
        @keyframes eq1 { from { transform: scaleY(0.4); } to { transform: scaleY(1); } }
        @keyframes eq2 { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }
      `}</style>
    </div>
  );
}
