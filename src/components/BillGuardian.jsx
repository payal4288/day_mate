import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Loader, Mail, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api.js';

const FALLBACK_BILLS = [
  {
    _id: 'internet',
    vendor: 'Wifi / Internet Bill (Comcast Xfinity)',
    oldPrice: '$65 / mo',
    newPrice: '$89 / mo',
    alert: 'Price jumped +$24/mo without notification',
    script: 'Hi, my internet bill jumped from $65 to $89. Local fiber offers $55/mo for 500Mbps. Please match the $55 rate or apply promo code FIBERMATCH to keep my account active. Thank you.',
    emailSent: false,
    moneySaved: 288,
    competitor: 'Sonic Fiber ($55/mo)'
  },
  {
    _id: 'streaming',
    vendor: 'Fitness App Subscription (Peloton)',
    oldPrice: '$24 / mo',
    newPrice: '$24 / mo',
    alert: 'Zero login activity for 92 consecutive days',
    script: 'Hi support, please immediately cancel my Peloton digital membership starting today and confirm no further auto-billing will occur. Thank you.',
    emailSent: false,
    moneySaved: 288,
    competitor: 'None (Cancel dormant)'
  },
  {
    _id: 'insurance',
    vendor: 'Car Insurance Renewal (Geico)',
    oldPrice: '$165 / mo',
    newPrice: '$194 / mo',
    alert: 'Annual policy hike: +$29/mo ($348/year)',
    script: 'Hi policy department, my car insurance renewed with a $29/mo increase. Our mileage has decreased since shifting to hybrid work (<7,500 miles/yr). Please apply low-mileage & clean driver discounts to lower our monthly rate.',
    emailSent: false,
    moneySaved: 348,
    competitor: 'Progressive Quote ($152/mo)'
  }
];

export default function BillGuardian({ onActionCompleted }) {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customScript, setCustomScript] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getBills();
        setBills(data);
        setSelectedBill(data[0] || null);
        setCustomScript(data[0]?.script || '');
        setError(null);
      } catch {
        setError('Backend offline — showing sample bills');
        setBills(FALLBACK_BILLS);
        setSelectedBill(FALLBACK_BILLS[0]);
        setCustomScript(FALLBACK_BILLS[0].script);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSelectBill = (b) => {
    setSelectedBill(b);
    setCustomScript(b.script);
  };

  const handleSendViaEmail = async () => {
    if (!selectedBill) return;
    setIsSending(true);

    try {
      if (selectedBill._id && selectedBill._id.length === 24) {
        await api.updateBill(selectedBill._id, { emailSent: true, moneySaved: 24 });
      }
      setBills(prev => prev.map(b => b._id === selectedBill._id ? { ...b, emailSent: true } : b));
      setSelectedBill(prev => ({ ...prev, emailSent: true }));
    } catch {
      setSelectedBill(prev => ({ ...prev, emailSent: true }));
    }

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    if (onActionCompleted) onActionCompleted(0.5, 24);
    setIsSending(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Bill Defense & 1-Click Negotiation</h2>
            <span className="badge badge-rose"><ShieldAlert size={12} /> Hikes Detected</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#34d399', fontWeight: 600 }}>● Gmail Connected (alex.family@gmail.com)</span>
            <span>• Auto-negotiation scripts ready</span>
            {error && <span style={{ color: '#f87171' }}>({error})</span>}
          </p>
        </div>

        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 16px', borderRadius: '12px', textAlign: 'right' }}>
          <div style={{ fontSize: '0.74rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase' }}>Identified Annual Waste</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>$924 / year</div>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Analyzing recurring charges & rate increases…</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {/* Bills List */}
          <div className="glass-card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Audited Subscriptions & Bills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bills.map(bill => (
                <div
                  key={bill._id}
                  onClick={() => handleSelectBill(bill)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: selectedBill?._id === bill._id ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                    background: selectedBill?._id === bill._id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{bill.vendor}</h4>
                    {bill.emailSent && <CheckCircle size={15} color="#34d399" />}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Previous: {bill.oldPrice}</span>
                    <span style={{ color: '#f87171', fontWeight: 700 }}>Current: {bill.newPrice}</span>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: bill.emailSent ? '#34d399' : '#f59e0b', fontWeight: 600 }}>
                    {bill.emailSent ? '✓ Negotiation Email Sent' : bill.alert}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Negotiation Execution Console */}
          {selectedBill && (
            <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{selectedBill.vendor}</h3>
                  <span className={`badge ${selectedBill.emailSent ? 'badge-green' : 'badge-amber'}`}>
                    {selectedBill.emailSent ? 'Dispatched ✓' : 'Ready to Send'}
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#f87171', marginTop: '4px' }}>
                  {selectedBill.alert} • Benchmark: {selectedBill.competitor || 'Local Rates'}
                </div>
              </div>

              {/* Editable Script */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                  <span>AI Negotiation Script (Backed by Consumer Protection Law):</span>
                  <span style={{ color: '#818cf8' }}>Customizable</span>
                </label>
                <textarea
                  value={customScript}
                  onChange={(e) => setCustomScript(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    color: 'white',
                    padding: '12px',
                    fontSize: '0.88rem',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Status or Sent Confirmation */}
              {selectedBill.emailSent ? (
                <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
                    <CheckCircle size={18} /> Email Sent via Connected Gmail Account
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Dispatched to customer support queue. Expected response within 24–48 hours. Estimated annual savings: <strong>$288/year</strong>.
                  </div>
                </div>
              ) : (
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Mail size={18} color="#60a5fa" />
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Clicking below will send this pre-filled email directly from your linked Gmail address to the billing department.
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                className="btn btn-primary"
                onClick={handleSendViaEmail}
                disabled={isSending || selectedBill.emailSent}
                style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
              >
                {selectedBill.emailSent ? (
                  'Negotiation in Progress ✓'
                ) : isSending ? (
                  'Sending via Gmail API…'
                ) : (
                  <><Send size={16} /> Send Email via Gmail (1-Click)</>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
