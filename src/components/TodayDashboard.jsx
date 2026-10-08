import React, { useState } from 'react';
import { Play, Pause, CheckCircle2, AlertTriangle, ArrowRight, UploadCloud, Sparkles, DollarSign, FileText, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const TODAY_ACTIONS = [
  {
    id: 'school',
    type: 'urgent',
    icon: FileText,
    category: 'School Form',
    title: "Leo's Science Museum Field Trip Form",
    subtitle: 'Due Friday • Needs parent signature & $18 fee confirmation',
    actionText: '1-Click Sign & Send',
    completedText: 'Signed & Submitted ✓',
    color: '#818cf8',
    hours: 0.5,
    money: 0
  },
  {
    id: 'bill',
    type: 'money',
    icon: DollarSign,
    category: 'Price Hike Alert',
    title: 'Comcast Internet Rate Jumped to $89/mo',
    subtitle: 'Normal was $65/mo (+$24 increase) • Competitor fiber offers $55',
    actionText: '1-Click Send Negotiation',
    completedText: 'Discount Requested ✓',
    color: '#f87171',
    hours: 0.5,
    money: 24
  },
  {
    id: 'maintenance',
    type: 'home',
    icon: AlertTriangle,
    category: 'Home Care',
    title: 'Furnace HVAC Filter (Size 20x25x1) Overdue',
    subtitle: 'Last changed 90 days ago • Replace now to protect system',
    actionText: '1-Click Order Filter ($29)',
    completedText: 'Filter Ordered ✓',
    color: '#fbbf24',
    hours: 0.3,
    money: 0
  }
];

export default function TodayDashboard({ onActionCompleted, onNavigate }) {
  const actions = TODAY_ACTIONS;
  const [completedIds, setCompletedIds] = useState([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleAction = (item) => {
    if (completedIds.includes(item.id)) return;
    setCompletedIds(prev => [...prev, item.id]);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    if (onActionCompleted) onActionCompleted(item.hours, item.money);
  };

  const toggleAudio = () => {
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      if (window.speechSynthesis) window.speechSynthesis.pause();
    } else {
      setIsAudioPlaying(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = "Good morning Alex! Today's three priority items: First, Leo's school museum trip permission form is ready for signature. Second, Comcast raised your internet bill by $24, and our price-match email is drafted. Third, your home furnace filter is due for replacement. You have eight and a half hours saved this month!";
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.onend = () => {
          setIsAudioPlaying(false);
          setAudioProgress(100);
        };
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Welcoming Hero Banner */}
      <div className="glass-card" style={{
        padding: '28px',
        background: 'linear-gradient(135deg, rgba(20, 25, 45, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-purple">Daily Command Center</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Thursday • All Systems Monitored
            </span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>
            Good morning, Alex & Sarah 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            You have <strong style={{ color: '#818cf8' }}>{actions.length - completedIds.length} tasks</strong> waiting for quick approval. AI has already prepared the details.
          </p>
        </div>

        {/* 60s Voice Briefing Button */}
        <div style={{
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid var(--border-glass)',
          padding: '12px 18px',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <button
            onClick={toggleAudio}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              border: 'none',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {isAudioPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
          </button>
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#e0e7ff' }}>
              {isAudioPlaying ? 'Playing Daily Briefing…' : 'Listen to 60s Update'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Spoken summary over morning coffee
            </div>
          </div>
        </div>
      </div>

      {/* 2. Today's Urgent 3 Items (The Core Value) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>⚡ Needs Your 1-Click Approval</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>
              ({completedIds.length} of {actions.length} resolved)
            </span>
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {actions.map(item => {
            const isDone = completedIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  border: isDone ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-glass)',
                  background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-card)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: isDone ? 'rgba(16,185,129,0.2)' : `${item.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isDone ? (
                      <CheckCircle2 size={22} color="#34d399" />
                    ) : (
                      <item.icon size={22} color={item.color} />
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.72rem', color: item.color, fontWeight: 700, textTransform: 'uppercase' }}>
                        {item.category}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: isDone ? '#9ca3af' : 'var(--text-main)', textDecoration: isDone ? 'line-through' : 'none' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <button
                  className={isDone ? 'btn btn-secondary' : 'btn btn-primary'}
                  onClick={() => handleAction(item)}
                  disabled={isDone}
                  style={{
                    minWidth: '180px',
                    justifyContent: 'center',
                    fontSize: '0.88rem'
                  }}
                >
                  {isDone ? (
                    item.completedText
                  ) : (
                    <><Sparkles size={15} /> {item.actionText}</>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Three Easy Pillars (Navigation Cards) */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px' }}>
          Explore Your Household Vault
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {[
            {
              tab: 'docs',
              title: '📄 Forms & Signatures',
              desc: 'School permission slips, doctor immunization forms, and clinic waivers.',
              badge: '3 stored forms',
              color: '#6366f1'
            },
            {
              tab: 'bills',
              title: '💳 Bills & Rate Defense',
              desc: 'Internet, auto insurance, and subscription negotiation scripts.',
              badge: '$924/yr potential savings',
              color: '#ec4899'
            },
            {
              tab: 'home',
              title: '🛠️ Home & Car Upkeep',
              desc: 'HVAC filter codes, water heater flushes, and chore delegation.',
              badge: 'Shared with Sarah',
              color: '#10b981'
            }
          ].map((c, idx) => (
            <div
              key={idx}
              className="glass-card"
              onClick={() => onNavigate && onNavigate(c.tab)}
              style={{
                padding: '22px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.25s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = c.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-glass)'}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{c.title}</h4>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                  {c.desc}
                </p>
              </div>
              <span className="badge badge-purple" style={{ alignSelf: 'flex-start', fontSize: '0.72rem' }}>
                {c.badge}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Quick Ingestion Box (Zero Friction) */}
      <div
        className="glass-card"
        onClick={() => onNavigate && onNavigate('ingest')}
        style={{
          padding: '22px 28px',
          border: '1px dashed rgba(99, 102, 241, 0.4)',
          background: 'rgba(99, 102, 241, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UploadCloud size={24} color="#818cf8" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>
              Got a new paper form, utility bill, or appliance photo?
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Forward via WhatsApp or snap with camera. AI extracts deadlines and fills details automatically.
            </div>
          </div>
        </div>

        <button className="btn btn-secondary" style={{ pointerEvents: 'none' }}>
          Open Ingestion Hub <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
