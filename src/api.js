/**
 * Thin API client for the DayMate Express backend.
 * All components use these helpers instead of raw fetch calls.
 */

const BASE = 'http://localhost:3001/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ── Documents ────────────────────────────────────────────────────────────────
export const api = {
  // Documents
  getDocuments: () => request('/documents'),
  createDocument: (body) =>
    request('/documents', { method: 'POST', body: JSON.stringify(body) }),
  updateDocument: (id, body) =>
    request(`/documents/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  // Bills
  getBills: () => request('/bills'),
  createBill: (body) =>
    request('/bills', { method: 'POST', body: JSON.stringify(body) }),
  updateBill: (id, body) =>
    request(`/bills/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  // Tasks
  getTasks: () => request('/tasks'),
  createTask: (body) =>
    request('/tasks', { method: 'POST', body: JSON.stringify(body) }),
  updateTask: (id, body) =>
    request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  // Chat
  getChatHistory: (sessionId = 'default') =>
    request(`/chat?sessionId=${sessionId}`),
  saveChatMessage: (sender, text, sessionId = 'default') =>
    request('/chat', { method: 'POST', body: JSON.stringify({ sender, text, sessionId }) }),
  clearChatHistory: (sessionId = 'default') =>
    request(`/chat?sessionId=${sessionId}`, { method: 'DELETE' }),

  // Vector Search
  search: (query, limit = 5) =>
    request('/search', { method: 'POST', body: JSON.stringify({ query, limit }) })
};
