import React from 'react';
import { FileText, DollarSign, Wrench, Volume2, ArrowRight } from 'lucide-react';

export default function HeroPitch({ onExploreDemo }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Header */}
      <div className="glass-card" style={{
        padding: '32px 28px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(20, 25, 45, 0.95) 0%, rgba(12, 14, 25, 0.95) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <span className="badge badge-purple" style={{ marginBottom: '12px' }}>
          Made for Busy 30–40 Year Olds
        </span>

        <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '12px' }}>
          Stop Doing Manual Life Tasks. <br />
          <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Let AI Handle It.
          </span>
        </h2>

        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 20px auto' }}>
          Save 8+ hours every week. AI fills your forms, cuts bad bills, and tracks home care.
        </p>

        <button className="btn btn-primary" onClick={onExploreDemo} style={{ margin: '0 auto' }}>
          Try Live Demo <ArrowRight size={18} />
        </button>
      </div>

      {/* 4 Simple Feature Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {[
          {
            icon: FileText,
            title: '1. Scan & Fill Forms',
            desc: 'Snap school or doctor forms. AI fills them in seconds.',
            color: '#6366f1'
          },
          {
            icon: DollarSign,
            title: '2. Stop Extra Charges',
            desc: 'Detects price hikes and auto-asks for lower rates.',
            color: '#ec4899'
          },
          {
            icon: Wrench,
            title: '3. Track Home & Car',
            desc: 'Reminds you before things break or need service.',
            color: '#10b981'
          },
          {
            icon: Volume2,
            title: '4. 60-Second Audio',
            desc: 'Quick morning audio update while you drink coffee.',
            color: '#f59e0b'
          }
        ].map((card, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: `${card.color}20`,
              border: `1px solid ${card.color}40`,
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              margin: '0 auto 12px auto'
            }}>
              <card.icon size={22} color={card.color} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{card.title}</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* ROI Box */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', justify: 'space-around', flexWrap: 'wrap', gap: '16px', textAlign: 'center' }}>
        <div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399' }}>8.5 Hours</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Saved every week</div>
        </div>
        <div style={{ borderLeft: '1px solid var(--border-glass)', paddingLeft: '20px' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8' }}>$1,400+</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Saved on bills per year</div>
        </div>
        <div style={{ borderLeft: '1px solid var(--border-glass)', paddingLeft: '20px' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24' }}>Zero Stress</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Never miss deadlines</div>
        </div>
      </div>
    </div>
  );
}
