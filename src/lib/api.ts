// API utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// API endpoints
export const api = {
  // Workers endpoints
  workers: {
    list: () => apiFetch('/workers'),
    create: (data: any) => apiFetch('/workers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => apiFetch(`/workers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => apiFetch(`/workers/${id}`, {
      method: 'DELETE',
    }),
  },

  // Companies endpoints
  companies: {
    list: () => apiFetch('/companies'),
    create: (data: any) => apiFetch('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => apiFetch(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => apiFetch(`/companies/${id}`, {
      method: 'DELETE',
    }),
  },
}; 