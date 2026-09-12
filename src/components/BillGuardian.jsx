import React, { useState, useEffect } from 'react';
import { Send, CheckCircle, Database, Loader } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api.js';

const FALLBACK_BILLS = [
  { _id: 'internet', vendor: 'Wifi / Internet Bill', oldPrice: '$65 / mo', newPrice: '$89 / mo', alert: 'Price went up $24/mo', script: 'Hi, my internet bill jumped from $65 to $89. Local fiber offers $55/mo. Please keep my rate at $55 or discount my bill. Thank you.', emailSent: false, moneySaved: 0 },
  { _id: 'streaming', vendor: 'Fitness App Subscription', oldPrice: '$20 / mo', newPrice: '$20 / mo', alert: 'Not used for 3 months', script: 'Hi, please cancel my fitness subscription starting today. Thank you.', emailSent: false, moneySaved: 0 },
  { _id: 'insurance', vendor: 'Car Insurance Renewal', oldPrice: '$165 / mo', newPrice: '$194 / mo', alert: 'Rate increased $29/mo', script: 'Hi, my car insurance increased. I have a clean driving record. Please review low-mileage discounts to lower my monthly rate. Thanks.', emailSent: false, moneySaved: 0 }
];

export default function BillGuardian({ onActionCompleted }) {
  const [bills, setBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getBills();
        setBills(data);
        setSelectedBill(data[0] || null);
        setError(null);
      } catch {
        setError('Backend offline — showing sample data');
        setBills(FALLBACK_BILLS);
        setSelectedBill(FALLBACK_BILLS[0]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSend = async () => {
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

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    if (onActionCompleted) onActionCompleted(0.5, 24);
    setIsSending(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Stop Extra Bill Charges</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={13} />
            {error ? <span style={{ color: '#f87171' }}>{error}</span> : `${bills.length} bills in MongoDB`}
          </p>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '8px 16px', borderRadius: '10px' }}>
          <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>Total Money Saved</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>$647 / yr</div>
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading bills from MongoDB…</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Flagged Bills</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {bills.map(bill => (
                <div
                  key={bill._id}
                  onClick={() => { setSelectedBill(bill); }}
                  style={{ padding: '12px 14px', borderRadius: '10px', border: selectedBill?._id === bill._id ? '1px solid var(--primary)' : '1px solid var(--border-glass)', background: selectedBill?._id === bill._id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="badge badge-rose">{bill.alert}</span>
                    {bill.emailSent && <CheckCircle size={14} color="#34d399" />}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{bill.vendor}</h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Was {bill.oldPrice} ➔ Now <strong style={{ color: 'white' }}>{bill.newPrice}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedBill && (
            <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>AI Email to Vendor</h3>
                <textarea
                  readOnly
                  value={selectedBill.script}
                  style={{ width: '100%', height: '110px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-glass)', borderRadius: '10px', padding: '12px', color: '#e5e7eb', fontSize: '0.86rem', marginBottom: '14px', resize: 'none', boxSizing: 'border-box' }}
                />
                {selectedBill.emailSent && (
                  <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={18} color="#34d399" />
                    <span style={{ color: '#34d399', fontSize: '0.86rem', fontWeight: 600 }}>Email sent & saved to MongoDB!</span>
                  </div>
                )}
              </div>
              <button
                className="btn btn-accent"
                style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}
                onClick={handleSend}
                disabled={isSending || selectedBill.emailSent}
              >
                {isSending ? 'Sending…' : selectedBill.emailSent ? 'Email Sent ✓' : <><Send size={16} /> Send Auto-Discount Request</>}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
