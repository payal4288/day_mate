import React, { useState } from 'react';
import { MessageSquare, Mail, Camera, CheckCircle2, Copy, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_SCENARIOS = [
  {
    type: 'whatsapp',
    title: '📱 WhatsApp Photo: Pediatric Doctor Form',
    raw: 'Attached image: dr_vance_vaccine_form.jpg (Maya, Age 5, Kindergarten entry booster record due before Oct 15)',
    extracted: {
      category: 'Medical / School Entry',
      child: 'Maya (Age 5)',
      clinic: 'Oakwood Pediatrics',
      action: 'Fill immunization dates & auto-sign parent waiver',
      urgency: 'Due Oct 15 (7 days left)'
    }
  },
  {
    type: 'email',
    title: '✉️ Forwarded Email: Water Utility Bill Hike',
    raw: 'Fwd: Your City Water & Sewer Bill for September is $142.50 (normal average $95.00). Tier-2 consumption spike alert.',
    extracted: {
      category: 'Utility Bill Alert',
      amount: '$142.50 (+$47.50 spike)',
      action: 'Draft email to City Water requesting leak review & credit',
      urgency: 'Due in 14 days'
    }
  },
  {
    type: 'camera',
    title: '📷 Camera Snap: Furnace Filter Model Plate',
    raw: 'Photo: Carrier Infinity 98 Furnance - Filter Slot: 20x25x1 MERV 11 (Last service date chalked on duct: 6 months ago)',
    extracted: {
      category: 'Home Appliance Specs',
      appliance: 'Carrier Furnace / AC System',
      filterCode: '20x25x1 MERV 11',
      action: 'Order 2-pack replacement ($28.90 on Amazon) & calendar 90-day alert',
      urgency: 'Overdue by 15 days'
    }
  }
];

export default function CaptureHub({ onActionCompleted }) {
  const [activeScenario, setActiveScenario] = useState(SAMPLE_SCENARIOS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedItem, setProcessedItem] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const forwardAddress = 'alex.family.vault@daymate.ai';

  const handleCopy = () => {
    navigator.clipboard?.writeText(forwardAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleIngest = (scenario = activeScenario) => {
    setIsProcessing(true);
    setProcessedItem(null);

    setTimeout(() => {
      setIsProcessing(false);
      setProcessedItem(scenario.extracted);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      if (onActionCompleted) onActionCompleted(0.5, scenario.extracted.amount ? 47.5 : 0);
    }, 1100);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-purple">Zero-Effort Ingestion</span>
              <span className="badge badge-green"><ShieldCheck size={12} /> 256-Bit Encrypted</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Never Log In to Type Paperwork Again</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '650px' }}>
              Forward any email, snap a photo via WhatsApp, or point your phone camera. Gemini AI auto-extracts deadlines, fills details, and schedules tasks.
            </p>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border-glass)',
            padding: '12px 18px',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Personal Inbox Forwarder:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <code style={{ color: '#a78bfa', fontWeight: 700, fontSize: '0.9rem' }}>{forwardAddress}</code>
              <button
                onClick={handleCopy}
                style={{
                  background: copiedEmail ? '#10b981' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedEmail ? 'Copied! ✓' : <><Copy size={12} /> Copy</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Input Methods Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {[
          {
            icon: MessageSquare,
            title: '1. WhatsApp Drop-In',
            color: '#25D366',
            desc: 'Text or send photos of school slips, plumber bills, or mail directly to our verified WhatsApp bot.'
          },
          {
            icon: Mail,
            title: '2. 1-Click Email Forwarding',
            color: '#60a5fa',
            desc: 'Set an auto-rule in Gmail/Outlook or forward renewal notices to automatically audit price hikes.'
          },
          {
            icon: Camera,
            title: '3. Camera Spec Scanner',
            color: '#f59e0b',
            desc: 'Snap serial plates on your fridge, HVAC, or car door jam. AI extracts model & filter codes instantly.'
          }
        ].map((m, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '20px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: `${m.color}20`,
              border: `1px solid ${m.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <m.icon size={22} color={m.color} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>{m.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Interactive Live Simulator */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Try the Ingestion Simulator</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Select a real-world scenario to see how Gemini structures unstructured mess into zero-click action items:
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {SAMPLE_SCENARIOS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveScenario(s);
                  setProcessedItem(null);
                }}
                style={{
                  background: activeScenario.title === s.title ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
                  color: activeScenario.title === s.title ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--border-glass)',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                {s.title.split(':')[0]}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Input Box */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '14px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#818cf8' }}>
              {activeScenario.title}
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '14px',
              borderRadius: '10px',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              fontStyle: 'italic',
              minHeight: '80px',
              border: '1px dashed rgba(255,255,255,0.1)'
            }}>
              "{activeScenario.raw}"
            </div>

            <button
              className="btn btn-primary"
              onClick={() => handleIngest(activeScenario)}
              disabled={isProcessing}
              style={{ marginTop: 'auto', justifyContent: 'center' }}
            >
              {isProcessing ? '⚡ Parsing with Gemini Vision…' : <><Sparkles size={16} /> Ingest & Auto-Execute</>}
            </button>
          </div>

          {/* AI Extraction Result */}
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '14px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#34d399' }}>
                Extracted Action Items
              </span>
              {processedItem && (
                <span className="badge badge-green"><CheckCircle2 size={12} /> Ready in Vault</span>
              )}
            </div>

            {isProcessing ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '10px', color: 'var(--text-muted)' }}>
                <div style={{ width: '28px', height: '28px', border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ fontSize: '0.85rem' }}>Extracting key dates, policy IDs, and action hooks…</span>
              </div>
            ) : processedItem ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                {Object.entries(processedItem).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k}:</span>
                    <span style={{ fontWeight: 600, color: '#e0e7ff', textAlign: 'right' }}>{v}</span>
                  </div>
                ))}
                <div style={{ marginTop: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} /> Saved to MongoDB Vector Vault & Synced to Family Calendar!
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.88rem', textAlign: 'center', padding: '20px' }}>
                Click "Ingest & Auto-Execute" to simulate instant extraction from photo or email.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
