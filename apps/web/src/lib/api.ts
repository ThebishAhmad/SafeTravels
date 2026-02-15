const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  auth: {
    sendOtp: (email: string) => apiFetch('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) }),
    verifyOtp: (email: string, otp: string) => apiFetch('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
    me: () => apiFetch('/api/auth/me'),
  },
  buses: {
    getRoutes: () => apiFetch('/api/buses/routes'),
    getRoute: (id: string) => apiFetch(`/api/buses/routes/${id}`),
    getActive: () => apiFetch('/api/buses/active'),
    getEta: (busId: string) => apiFetch(`/api/buses/eta/${busId}`),
  },
  rides: {
    list: () => apiFetch('/api/rides'),
    create: (data: { dest: string; departureTime: string; maxPassengers: number; gender: string }) =>
      apiFetch('/api/rides', { method: 'POST', body: JSON.stringify(data) }),
    join: (id: string) => apiFetch(`/api/rides/${id}/join`, { method: 'POST' }),
    getFares: () => apiFetch('/api/rides/fares'),
  },
  complaints: {
    list: () => apiFetch('/api/complaints'),
    create: (data: { type: string; target?: string; description: string }) =>
      apiFetch('/api/complaints', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      apiFetch(`/api/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
};
