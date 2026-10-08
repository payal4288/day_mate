import React, { useState, useEffect } from 'react';
import { Send, Loader, Calendar, ShoppingCart, Users, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api.js';

const FALLBACK_TASKS = [
  {
    _id: 'hvac',
    name: 'Home Furnace / AC System',
    status: 'Filter Change Due',
    action: 'Change AC filter (Size 20x25x1 MERV 11)',
    contractor: 'Apex Heating & AC ($85 tune-up)',
    partLink: 'Amazon 2-Pack MERV 11 ($29.90)',
    assignedTo: 'Alex',
    booked: false,
    syncedCalendar: false
  },
  {
    _id: 'car',
    name: 'Family SUV (Honda Odyssey)',
    status: 'Oil Change Needed (5,000 mi)',
    action: 'Full Synthetic 0W-20 & Tire Rotation',
    contractor: 'Honda Certified Express (Saturday 9 AM)',
    partLink: 'Mobile Mechanic or Dealer',
    assignedTo: 'Sarah',
    booked: false,
    syncedCalendar: false
  },
  {
    _id: 'water',
    name: '50-Gal Water Heater Tank',
    status: 'Annual Sediment Flush Due',
    action: 'Flush sediment to prevent tank rupture & corrosion',
    contractor: 'Local Master Plumber ($95 service)',
    partLink: 'Garden hose drain valve',
    assignedTo: 'Alex',
    booked: false,
    syncedCalendar: false
  }
];

export default function HomeMaintenance({ onActionCompleted }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [partnerFilter, setPartnerFilter] = useState('all'); // 'all' | 'Alex' | 'Sarah'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getTasks();
        const mapped = data.map((t, i) => ({
          ...t,
          assignedTo: t.assignedTo || (i % 2 === 0 ? 'Alex' : 'Sarah'),
          syncedCalendar: false
        }));
        setTasks(mapped);
        setSelectedTask(mapped[0] || null);
        setError(null);
      } catch {
        setError('Backend offline — showing sample household items');
        setTasks(FALLBACK_TASKS);
        setSelectedTask(FALLBACK_TASKS[0]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filteredTasks = tasks.filter(t => {
    if (partnerFilter === 'all') return true;
    return t.assignedTo === partnerFilter;
  });

  const handleToggleAssign = (task, newAssignee) => {
    const updated = { ...task, assignedTo: newAssignee };
    setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
    if (selectedTask?._id === task._id) setSelectedTask(updated);
  };

  const handleSyncCalendar = (task) => {
    const updated = { ...task, syncedCalendar: true };
    setTasks(prev => prev.map(t => t._id === task._id ? updated : t));
    if (selectedTask?._id === task._id) setSelectedTask(updated);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    if (onActionCompleted) onActionCompleted(0.2, 0);
  };

  const handleBookService = async () => {
    if (!selectedTask) return;

    try {
      if (selectedTask._id && selectedTask._id.length === 24) {
        await api.updateTask(selectedTask._id, { booked: true, status: 'Booked' });
      }
      setTasks(prev => prev.map(t => t._id === selectedTask._id ? { ...t, booked: true } : t));
      setSelectedTask(prev => ({ ...prev, booked: true }));
    } catch {
      setSelectedTask(prev => ({ ...prev, booked: true }));
    }

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    if (onActionCompleted) onActionCompleted(0.5, 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Home & Car Maintenance Hub</h2>
            <span className="badge badge-purple">Dual-Partner Sync</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Never fight over chores again. Shared tracking with partner delegation & 1-click booking. {error && <span style={{ color: '#f87171' }}>({error})</span>}
          </p>
        </div>

        {/* Partner Delegation Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px' }}>
          <Users size={14} color="#818cf8" style={{ marginLeft: '6px' }} />
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'Alex', label: 'Alex' },
            { id: 'Sarah', label: 'Sarah' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPartnerFilter(p.id)}
              style={{
                background: partnerFilter === p.id ? 'var(--primary-gradient)' : 'transparent',
                color: partnerFilter === p.id ? 'white' : 'var(--text-muted)',
                border: 'none',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: partnerFilter === p.id ? 700 : 500
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading household appliances and maintenance schedule…</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {/* Tasks List */}
          <div className="glass-card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Household Schedule</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredTasks.map(task => (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(task)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: selectedTask?._id === task._id ? '1px solid var(--primary)' : '1px solid var(--border-glass)',
                    background: selectedTask?._id === task._id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{task.name}</h4>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.08)', padding: '2px 8px', borderRadius: '10px', color: '#a78bfa', fontWeight: 600 }}>
                      👤 {task.assignedTo}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: task.booked ? '#34d399' : '#f59e0b', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{task.booked ? 'Booked ✓' : task.status}</span>
                    {task.syncedCalendar && <span style={{ color: '#60a5fa', fontSize: '0.75rem' }}>📅 Cal Synced</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action & Delegation Console */}
          {selectedTask && (
            <div className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{selectedTask.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Status: <span style={{ color: '#f59e0b', fontWeight: 600 }}>{selectedTask.status}</span>
                  </div>
                </div>
                <span className={`badge ${selectedTask.booked ? 'badge-green' : 'badge-amber'}`}>
                  {selectedTask.booked ? 'Completed' : 'Pending'}
                </span>
              </div>

              {/* Action Details */}
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.88rem' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Action Required:</strong>
                  <div style={{ color: '#e0e7ff', marginTop: '2px' }}>{selectedTask.action}</div>
                </div>

                <div style={{ fontSize: '0.88rem' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Vetted Local Pro:</strong>
                  <div style={{ color: '#34d399', marginTop: '2px' }}>{selectedTask.contractor}</div>
                </div>

                {selectedTask.partLink && (
                  <div style={{ fontSize: '0.84rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Exact Replacement Part:</span>
                    <a
                      href="#buy-part"
                      onClick={(e) => { e.preventDefault(); alert(`Opening 1-click cart for: ${selectedTask.partLink}`); }}
                      style={{ color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      <ShoppingCart size={13} /> {selectedTask.partLink} <ArrowUpRight size={12} />
                    </a>
                  </div>
                )}
              </div>

              {/* Partner Re-assignment */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>Assigned Partner:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['Alex', 'Sarah'].map(name => (
                    <button
                      key={name}
                      onClick={() => handleToggleAssign(selectedTask, name)}
                      style={{
                        background: selectedTask.assignedTo === name ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.08)',
                        border: 'none',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleSyncCalendar(selectedTask)}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Calendar size={15} />
                  {selectedTask.syncedCalendar ? 'Calendar Synced ✓' : 'Add to Family Cal'}
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handleBookService}
                  disabled={selectedTask.booked}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {selectedTask.booked ? 'Service Booked ✓' : <><Send size={15} /> Book Contractor</>}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
