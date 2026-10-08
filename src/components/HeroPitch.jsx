import React, { useState } from 'react';
import { FileText, DollarSign, Volume2, ArrowRight, ShieldCheck, Users, Check, Sparkles, Calculator } from 'lucide-react';

export default function HeroPitch({ onExploreDemo, onSelectTab }) {
  const [billsCount, setBillsCount] = useState(4);
  const [kidsCount, setKidsCount] = useState(2);
  const [billingCycle, setBillingCycle] = useState('yearly'); // 'monthly' | 'yearly'

  // ROI Calculator
  const estimatedCashSaved = billsCount * 280; // ~$280 saved per negotiated bill/year
  const estimatedHoursSaved = (billsCount * 1.5) + (kidsCount * 3.5) + 3; // hours/month

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero Header */}
      <div className="glass-card" style={{
        padding: '38px 28px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(20, 25, 45, 0.95) 0%, rgba(12, 14, 25, 0.95) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span className="badge badge-purple">
            Built for 30–40 Year Old Professionals & Families
          </span>
          <span className="badge badge-green">
            <ShieldCheck size={12} /> 100% ROI Guarantee
          </span>
        </div>

        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
          Stop Doing Manual Life Admin. <br />
          <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Let AI Auto-Sign, Negotiate, & Maintain.
          </span>
        </h2>

        <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
          School forms, unexpected bill increases, water heater flushes, and contractor quotes cost you 8+ hours every week. DayMate automates the mental load for you and your partner.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onExploreDemo}>
            Explore Live Product <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary" onClick={() => onSelectTab && onSelectTab('ingest')}>
            Try WhatsApp Ingestion
          </button>
        </div>
      </div>

      {/* Interactive ROI Calculator */}
      <div className="glass-card" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={20} color="#34d399" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Calculate Your Household ROI</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>See how much time and money DayMate pays you back each year:</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span>Monthly Recurring Bills (Internet, Insurance, Subs):</span>
                <strong style={{ color: '#818cf8' }}>{billsCount} bills</strong>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={billsCount}
                onChange={e => setBillsCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                <span>Children / Dependents (School slips, Doctor forms):</span>
                <strong style={{ color: '#ec4899' }}>{kidsCount} kids</strong>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={kidsCount}
                onChange={e => setKidsCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#ec4899' }}
              />
            </div>
          </div>

          {/* Results Badge */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.84rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              Your Annual Net Savings
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#34d399', lineHeight: 1 }}>
              ${estimatedCashSaved.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '8px 0 16px 0' }}>
              + {Math.round(estimatedHoursSaved * 12)} hours of family time reclaimed
            </div>
            <div style={{ fontSize: '0.78rem', color: '#9ca3af', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
              Based on average bill negotiations ($24–$35/mo cut) & automated form turnaround.
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {[
          {
            icon: FileText,
            title: '1. Form AutoPilot & Sign',
            desc: 'Auto-fills pediatric medical records & school slips with your saved signature in 1 click.',
            color: '#6366f1'
          },
          {
            icon: DollarSign,
            title: '2. 1-Click Bill Defense',
            desc: 'Detects rate hikes and automatically sends negotiation letters to internet & car insurers.',
            color: '#ec4899'
          },
          {
            icon: Users,
            title: '3. Dual-Partner Sync',
            desc: 'Assigns chores & maintenance tasks to you or your spouse with family calendar sync.',
            color: '#10b981'
          },
          {
            icon: Volume2,
            title: '4. Voice & WhatsApp Digest',
            desc: 'Listen to a natural 60-second voice update or receive a quick WhatsApp morning checklist.',
            color: '#f59e0b'
          }
        ].map((card, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '22px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: `${card.color}20`,
              border: `1px solid ${card.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <card.icon size={22} color={card.color} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{card.title}</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Transparent Pricing Plans (Why People Will Purchase) */}
      <div className="glass-card" style={{ padding: '32px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 24px auto' }}>
          <span className="badge badge-amber" style={{ marginBottom: '8px' }}>Simple, Honest Pricing</span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Plans That Pay For Themselves</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            If DayMate doesn't save you more than its subscription cost on bills in 60 days, get a 100% instant refund.
          </p>

          <div style={{ display: 'inline-flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '10px', marginTop: '16px' }}>
            <button
              onClick={() => setBillingCycle('monthly')}
              style={{
                background: billingCycle === 'monthly' ? 'var(--primary-gradient)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              style={{
                background: billingCycle === 'yearly' ? 'var(--primary-gradient)' : 'transparent',
                color: 'white',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              Yearly (Save 25%) 🏷️
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Free Explorer */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Free Explorer</h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Test the AI vault with your first documents</p>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '18px' }}>
              $0 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>forever</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> 5 Documents in Vector Vault</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> 1 Bill Price Audit & Script</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> Manual Web Upload</li>
            </ul>
            <button className="btn btn-secondary" onClick={onExploreDemo} style={{ marginTop: 'auto', justifyContent: 'center' }}>
              Start Free
            </button>
          </div>

          {/* Pro Copilot (Featured) */}
          <div className="glass-card" style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            border: '2px solid #6366f1',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(18, 22, 36, 0.8) 100%)',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', top: '-12px', right: '20px', background: 'var(--primary-gradient)', color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              MOST POPULAR
            </div>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Pro Copilot</h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>For busy solo professionals & parents</p>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '18px' }}>
              {billingCycle === 'yearly' ? '$6.99' : '$8.99'} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ mo</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '24px' }}>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> Unlimited Document & Form Vault</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> WhatsApp & Email Forwarding</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> 1-Click PDF Auto-Sign & Send</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> Automated Bill Price Negotiations</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> Daily Voice Audio Briefing</li>
            </ul>
            <button className="btn btn-primary" onClick={onExploreDemo} style={{ marginTop: 'auto', justifyContent: 'center' }}>
              Start 14-Day Free Trial
            </button>
          </div>

          {/* Household / Family */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Family & Partner</h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Share the mental load with your partner</p>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '18px' }}>
              {billingCycle === 'yearly' ? '$11.99' : '$14.99'} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ mo</span>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> Everything in Pro</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> 2 Adult Accounts with Shared Sync</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> Multiple Kid & Vehicle Profiles</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> Google / Apple Calendar Sync</li>
              <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Check size={16} color="#34d399" /> Contractor Bidding & Booking</li>
            </ul>
            <button className="btn btn-secondary" onClick={onExploreDemo} style={{ marginTop: 'auto', justifyContent: 'center' }}>
              Select Family Plan
            </button>
          </div>
        </div>
      </div>

      {/* Trust & Bank-Grade Security Footer */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '14px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldCheck size={28} color="#34d399" />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>256-Bit AES Encryption</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Bank-grade document protection</div>
          </div>
        </div>
        <div style={{ borderLeft: '1px solid var(--border-glass)', paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={28} color="#818cf8" />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Zero AI Training on Your Data</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Private MongoDB & Gemini embeddings</div>
          </div>
        </div>
        <div style={{ borderLeft: '1px solid var(--border-glass)', paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <DollarSign size={28} color="#fbbf24" />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>60-Day Money-Back Guarantee</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No savings = full refund</div>
          </div>
        </div>
      </div>
    </div>
  );
}
