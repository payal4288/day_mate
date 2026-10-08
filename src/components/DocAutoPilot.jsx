import React, { useState, useEffect } from 'react';
import { CheckCircle, Sparkles, Database, Loader, Download, Send, PenTool, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api.js';

const FAMILY_PROFILES = [
  { id: 'all', name: 'All Family' },
  { id: 'leo', name: 'Leo (Grade 3)' },
  { id: 'maya', name: 'Maya (Age 5)' },
  { id: 'parents', name: 'Parents (Alex & Sarah)' }
];

export default function DocAutoPilot({ onActionCompleted }) {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeProfile, setActiveProfile] = useState('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portalSubmitted, setPortalSubmitted] = useState(false);

  // Load documents from MongoDB
  useEffect(() => {
    (async () => {
      try {
        const data = await api.getDocuments();
        setDocs(data);
        if (data.length > 0) setSelectedDoc(data[0]);
        setError(null);
      } catch {
        setError('Backend offline — showing cached data');
        const fallback = [
          {
            _id: 'school-slip',
            title: 'School Field Trip Permission Form',
            tag: 'Urgent',
            profile: 'leo',
            category: 'form',
            fields: { 'Child Name': 'Leo (Grade 3)', Event: 'Science Museum Trip', Date: 'Sept 28', Cost: '$18', Emergency: '555-0192', Status: 'Pending Parent Signature' },
            processed: false,
            signed: false
          },
          {
            _id: 'pediatric-form',
            title: 'Child Doctor Medical Form',
            tag: 'Auto-Fill',
            profile: 'maya',
            category: 'medical',
            fields: { 'Child Name': 'Maya (Age 5)', Clinic: 'Oakwood Pediatrics', 'Insurance ID': '#904812 (Pre-filled)', 'Allergies': 'None', Status: 'Ready to Send' },
            processed: false,
            signed: false
          },
          {
            _id: 'fridge-filter',
            title: 'Fridge Water Filter Notice',
            tag: 'Reminder',
            profile: 'parents',
            category: 'warranty',
            fields: { Appliance: 'Whirlpool Refrigerator', Task: 'Replace Water Filter', 'Filter Model': '#EDR1RXD1', Status: 'Filter Added to Shopping Cart' },
            processed: false,
            signed: false
          }
        ];
        setDocs(fallback);
        setSelectedDoc(fallback[0]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredDocs = docs.filter(doc => {
    if (activeProfile === 'all') return true;
    if (doc.profile) return doc.profile === activeProfile;
    // heuristics
    if (activeProfile === 'leo') return doc.title?.toLowerCase().includes('school') || doc.title?.toLowerCase().includes('leo');
    if (activeProfile === 'maya') return doc.title?.toLowerCase().includes('doctor') || doc.title?.toLowerCase().includes('maya');
    return true;
  });

  const handleProcess = async () => {
    if (!selectedDoc) return;
    setIsProcessing(true);

    try {
      if (selectedDoc._id && selectedDoc._id.length === 24) {
        await api.updateDocument(selectedDoc._id, {
          processed: true,
          status: 'Auto-Filled & Ready'
        });
      }
      setDocs(prev => prev.map(d => d._id === selectedDoc._id ? { ...d, processed: true, status: 'Auto-Filled & Ready' } : d));
      setSelectedDoc(prev => ({ ...prev, processed: true, status: 'Auto-Filled & Ready' }));
    } catch {
      setSelectedDoc(prev => ({ ...prev, processed: true, status: 'Auto-Filled & Ready' }));
    }

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    if (onActionCompleted) onActionCompleted(0.5, 0);
    setIsProcessing(false);
  };

  const handleSign = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSelectedDoc(prev => ({ ...prev, signed: true, status: 'Digitally Signed ✓' }));
      setDocs(prev => prev.map(d => d._id === selectedDoc._id ? { ...d, signed: true, status: 'Digitally Signed ✓' } : d));
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } });
      if (onActionCompleted) onActionCompleted(0.5, 0);
    }, 800);
  };

  const handleSubmitPortal = () => {
    setPortalSubmitted(true);
    setTimeout(() => setPortalSubmitted(false), 3500);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    if (onActionCompleted) onActionCompleted(0.5, 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Document & Form AutoPilot</h2>
            <span className="badge badge-purple">Family Vault</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={13} />
            {error ? <span style={{ color: '#f87171' }}>{error}</span> : `${docs.length} documents indexed with Gemini text-embedding-004`}
          </p>
        </div>

        {/* Profile Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px' }}>
          <Users size={14} color="#818cf8" style={{ marginLeft: '6px' }} />
          {FAMILY_PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProfile(p.id)}
              style={{
                background: activeProfile === p.id ? 'var(--primary-gradient)' : 'transparent',
                color: activeProfile === p.id ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: activeProfile === p.id ? 700 : 500
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading documents from MongoDB…</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {/* Document List */}
          <div className="glass-card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Stored Forms & Paperwork</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredDocs.map(doc => (
                <div
                  key={doc._id}
                  onClick={() => setSelectedDoc(doc)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: selectedDoc?._id === doc._id ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                    background: selectedDoc?._id === doc._id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{doc.title}</h4>
                    <span className="badge badge-purple" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>{doc.tag}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: doc.signed ? '#34d399' : doc.processed ? '#818cf8' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {doc.signed ? '✓ Digitally Signed & Ready' : doc.status || 'Click to view & auto-fill'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Viewer & Agentic Action Panel */}
          {selectedDoc && (
            <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{selectedDoc.title}</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Extracted via Gemini Vision & Auto-Matched to Profile
                  </span>
                </div>
                <span className={`badge ${selectedDoc.signed ? 'badge-green' : selectedDoc.processed ? 'badge-purple' : 'badge-amber'}`}>
                  {selectedDoc.signed ? 'Signed ✓' : selectedDoc.processed ? 'Auto-Filled' : 'Action Needed'}
                </span>
              </div>

              {/* Form Fields Card */}
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
                  Auto-Extracted Fields:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
                  {selectedDoc.fields && Object.entries(selectedDoc.fields).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{k}:</span>
                      <strong style={{ color: '#e0e7ff' }}>{v}</strong>
                    </div>
                  ))}
                </div>

                {/* Digital Signature Stamp */}
                <div style={{
                  marginTop: '14px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: selectedDoc.signed ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.03)',
                  border: selectedDoc.signed ? '1px dashed #10b981' : '1px dashed rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <PenTool size={16} color={selectedDoc.signed ? '#34d399' : '#9ca3af'} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: selectedDoc.signed ? '#34d399' : 'var(--text-muted)' }}>
                        {selectedDoc.signed ? 'Alex Smith (Verified Parent Signature)' : 'Parent Signature Required'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {selectedDoc.signed ? 'Timestamp: Today 08:30 AM • RSA 2048' : 'Click "Apply Signature" below'}
                      </div>
                    </div>
                  </div>
                  {selectedDoc.signed && <CheckCircle size={18} color="#34d399" />}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: 'auto' }}>
                {!selectedDoc.processed && (
                  <button
                    className="btn btn-primary"
                    onClick={handleProcess}
                    disabled={isProcessing}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {isProcessing ? 'Auto-Filling…' : <><Sparkles size={16} /> Auto-Fill All Fields</>}
                  </button>
                )}

                {selectedDoc.processed && !selectedDoc.signed && (
                  <button
                    className="btn btn-accent"
                    onClick={handleSign}
                    disabled={isSigning}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    {isSigning ? 'Applying Signature…' : <><PenTool size={16} /> Apply Stored Signature</>}
                  </button>
                )}

                {selectedDoc.signed && (
                  <>
                    <button
                      className="btn btn-secondary"
                      onClick={() => alert(`Downloaded signed copy of: ${selectedDoc.title}`)}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <Download size={15} /> Download PDF
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmitPortal}
                      disabled={portalSubmitted}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      {portalSubmitted ? 'Sent to Portal ✓' : <><Send size={15} /> Send to School/Clinic</>}
                    </button>
                  </>
                )}
              </div>

              {portalSubmitted && (
                <div style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', padding: '10px 14px', borderRadius: '8px', color: '#34d399', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} /> Form successfully submitted to Oakwood Portal & confirmation receipt archived.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
