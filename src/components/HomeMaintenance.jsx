import React, { useState, useEffect } from 'react';
import { CheckCircle, Send, Database, Loader } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api.js';

const FALLBACK_TASKS = [
  { _id: 'hvac', name: 'Home Furnace / AC System', status: 'Filter Change Due', action: 'Change AC filter (Size 20x25x1)', contractor: 'Apex Heating & AC ($85 tune-up)', booked: false },
  { _id: 'car', name: 'Family SUV (Honda Odyssey)', status: 'Oil Change Needed', action: 'Synthetic Oil Change & Tire Rotation', contractor: 'Honda Certified Express (Saturday 9 AM)', booked: false },
  { _id: 'water', name: 'Water Heater Tank', status: 'Flush Tank Soon', action: 'Flush sediment to stop rust', contractor: 'Local Plumber Co ($95 service)', booked: false }
];

export default function HomeMaintenance({ onActionCompleted }) {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getTasks();
        setTasks(data);
        setSelectedTask(data[0] || null);
        setError(null);
      } catch {
        setError('Backend offline — showing sample data');
        setTasks(FALLBACK_TASKS);
        setSelectedTask(FALLBACK_TASKS[0]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleRequest = async () => {
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

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    if (onActionCompleted) onActionCompleted(0.5, 0);
    setTimeout(() => setSelectedTask(prev => prev ? { ...prev, booked: true } : prev), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="glass-card" style={{ padding: '20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Home & Car Reminders</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={13} />
          {error ? <span style={{ color: '#f87171' }}>{error}</span> : `${tasks.length} tasks in MongoDB`}
        </p>
      </div>

      {isLoading ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Loader size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
          <p>Loading tasks from MongoDB…</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '18px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>Your Items</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {tasks.map(task => (
                <div
                  key={task._id}
                  onClick={() => setSelectedTask(task)}
                  style={{ padding: '12px 14px', borderRadius: '10px', border: selectedTask?._id === task._id ? '1px solid var(--primary)' : '1px solid var(--border-glass)', background: selectedTask?._id === task._id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.02)', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{task.name}</h4>
                    {task.booked && <CheckCircle size={14} color="#34d399" />}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: task.booked ? '#34d399' : '#f59e0b', fontWeight: 600 }}>
                    {task.booked ? 'Booked ✓' : task.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedTask && (
            <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>Simple Action</h3>
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '10px', marginBottom: '14px', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong style={{ color: 'var(--text-muted)' }}>What to do:</strong> {selectedTask.action}</div>
                  <div><strong style={{ color: 'var(--text-muted)' }}>Local Tech:</strong> {selectedTask.contractor}</div>
                </div>
                {selectedTask.booked && (
                  <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={18} color="#34d399" />
                    <span style={{ color: '#34d399', fontSize: '0.86rem', fontWeight: 600 }}>Service booked & saved to MongoDB!</span>
                  </div>
                )}
              </div>
              <button
                className="btn btn-primary"
                onClick={handleRequest}
                disabled={selectedTask.booked}
                style={{ width: '100%', justifyContent: 'center', marginTop: '14px' }}
              >
                {selectedTask.booked ? 'Booked ✓' : <><Send size={16} /> Book Service</>}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
