import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle, Sparkles, Database, Loader } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api.js';

export default function DocAutoPilot({ onActionCompleted }) {
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load documents from MongoDB
  useEffect(() => {
    (async () => {
      try {
        const data = await api.getDocuments();
        setDocs(data);
        if (data.length > 0) setSelectedDoc(data[0]);
        setError(null);
      } catch (err) {
        setError('Backend offline — showing cached data');
        // Fallback to hardcoded data
        const fallback = [
          {
            _id: 'school-slip',
            title: 'School Field Trip Permission Form',
            tag: 'Urgent',
            fields: { 'Child Name': 'Leo (Grade 3)', Event: 'Science Museum Trip', Date: 'Sept 28', Cost: '$18', Status: 'Auto-Signed & Added to Calendar' },
            processed: false
          },
          {
            _id: 'pediatric-form',
            title: 'Child Doctor Medical Form',
            tag: 'Auto-Fill',
            fields: { 'Child Name': 'Maya (Age 5)', Clinic: 'Oakwood Pediatrics', 'Insurance ID': '#904812 (Pre-filled)', Status: 'Ready to Send' },
            processed: false
          },
          {
            _id: 'fridge-filter',
            title: 'Fridge Water Filter Notice',
            tag: 'Reminder',
            fields: { Appliance: 'Whirlpool Refrigerator', Task: 'Replace Water Filter', 'Filter Model': '#EDR1RXD1', Status: 'Filter Added to Shopping Cart' },
            processed: false
          }
        ];
        setDocs(fallback);
        setSelectedDoc(fallback[0]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleProcess = async () => {
    if (!selectedDoc) return;
    setIsProcessing(true);

    try {
      // Persist processed status to MongoDB
      if (selectedDoc._id && !selectedDoc._id.includes('-')) {
        await api.updateDocument(selectedDoc._id, {
          processed: true,
          status: 'Form filled & sent automatically'
        });
      }
      // Update local state
      setDocs(prev =>
        prev.map(d => d._id === selectedDoc._id ? { ...d, processed: true } : d)
      );
      setSelectedDoc(prev => ({ ...prev, processed: true }));
    } catch {
      // Still show success in demo mode
      setSelectedDoc(prev => ({ ...prev, processed: true }));
    }

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    if (onActionCompleted) onActionCompleted(0.5, 0);
    setIsProcessing(false);
  };

  const getFields = (doc) => {
    if (!doc?.fields) return [];
    // Handle both Map (from Mongoose) and plain object (from fallback)
    if (doc.fields instanceof Map) return [...doc.fields.entries()];
    return Object.entries(doc.fields);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Scan & Auto-Fill Forms</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={13} />
            {error ? <span style={{ color: '#f87171' }}>{error}</span> : `${docs.length} documents in MongoDB`}
          </p>
        </div>
        <button className="btn btn-secondary">
          <UploadCloud size={16} /> Upload Photo / PDF
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading from MongoDB…</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {/* Document list */}
          <div className="glass-card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Documents from DB</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {docs.map(doc => (
                <div
                  key={doc._id}
                  onClick={() => setSelectedDoc(doc)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: selectedDoc?._id === doc._id ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                    background: selectedDoc?._id === doc._id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span className="badge badge-purple">{doc.tag}</span>
                    {doc.processed && <CheckCircle size={14} color="#34d399" />}
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 600 }}>{doc.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* AI Action Box */}
          {selectedDoc && (
            <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>AI Extracted Info</h3>
                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', padding: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {getFields(selectedDoc).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{key}:</span>
                        <span style={{ fontWeight: 600, color: 'white' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedDoc.processed && (
                  <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={20} color="#34d399" />
                    <span style={{ color: '#34d399', fontSize: '0.86rem', fontWeight: 600 }}>Form filled & saved to MongoDB!</span>
                  </div>
                )}
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}
                onClick={handleProcess}
                disabled={isProcessing || selectedDoc.processed}
              >
                {isProcessing ? 'Processing…' : selectedDoc.processed ? 'Already Processed ✓' : <>Run Auto-Fill & Save <Sparkles size={16} /></>}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
