import { getAuthToken } from './auth-context';

// API utility functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
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
    list: () => fetchWithAuth('/workers'),
    create: (data: any) => fetchWithAuth('/workers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => fetchWithAuth(`/workers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchWithAuth(`/workers/${id}`, {
      method: 'DELETE',
    }),
  },

  // Companies endpoints
  companies: {
    list: () => fetchWithAuth('/companies'),
    create: (data: any) => fetchWithAuth('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: any) => fetchWithAuth(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => fetchWithAuth(`/companies/${id}`, {
      method: 'DELETE',
    }),
  },

  // Employees
  getEmployees: () => fetchWithAuth('/employees'),
  createEmployee: (data: any) => fetchWithAuth('/employees', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateEmployee: (id: string, data: any) => fetchWithAuth(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteEmployee: (id: string) => fetchWithAuth(`/employees/${id}`, {
    method: 'DELETE',
  }),
}; 