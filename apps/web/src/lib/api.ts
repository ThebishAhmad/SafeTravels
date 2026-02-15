const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  const headers = new Headers(options?.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
      try {
        const text = await res.text();
        if (text) {
          const err = JSON.parse(text);
          errorMessage = err.error || errorMessage;
        }
      } catch (e) {
        // Fallback if not JSON
      }
      console.warn(`[API] ${path} failed:`, errorMessage);
      throw new Error(errorMessage);
    }

    return res.json();
  } catch (err: any) {
    if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('network'))) {
      console.warn(`[API] Connection failed to ${url}`);
      throw new Error(`Connection failed. Is the backend running on ${API_BASE}?`);
    }
    throw err;
  }
}

// Safe wrapper that returns a default value instead of crashing
async function safeFetch<T>(path: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    return await apiFetch<T>(path, options);
  } catch (err) {
    console.warn(`[API] Using fallback for ${path}:`, (err as Error).message);
    return fallback;
  }
}

export const api = {
  auth: {
    sendOtp: (email: string) => apiFetch('/api/auth/send-otp', { method: 'POST', body: JSON.stringify({ email }) }),
    verifyOtp: (email: string, otp: string) => apiFetch('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otp }) }),
    me: () => apiFetch('/api/auth/me'),
  },
  buses: {
    getRoutes: () => safeFetch('/api/buses/routes', []),
    getRoute: (id: string) => apiFetch(`/api/buses/routes/${id}`),
    getActive: () => safeFetch('/api/buses/active', []),
    getEta: (busId: string) => apiFetch(`/api/buses/eta/${busId}`),
  },
  rides: {
    list: () => safeFetch('/api/rides', []),
    create: (data: { dest: string; departureTime: string; maxPassengers: number; gender: string }) =>
      apiFetch('/api/rides', { method: 'POST', body: JSON.stringify(data) }),
    join: (id: string) => apiFetch(`/api/rides/${id}/join`, { method: 'POST' }),
    getFares: () => safeFetch('/api/rides/fares', []),
  },
  complaints: {
    list: () => safeFetch('/api/complaints', []),
    create: (data: { type: string; target?: string; description: string }) =>
      apiFetch('/api/complaints', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id: string, status: string) =>
      apiFetch(`/api/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
};
