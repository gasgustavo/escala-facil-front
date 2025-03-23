'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

export default function EmpresasPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCompany, setNewCompany] = useState({ name: '', cnpj: '' });
  const { user } = useAuth();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await api.companies.list();
      setCompanies(data);
    } catch (err) {
      setError('Failed to fetch companies');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.companies.create(newCompany);
      setNewCompany({ name: '', cnpj: '' });
      fetchCompanies();
    } catch (err) {
      setError('Failed to create company');
      console.error('Error creating company:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Companies</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Company Name"
            value={newCompany.name}
            onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="CNPJ"
            value={newCompany.cnpj}
            onChange={(e) => setNewCompany({ ...newCompany, cnpj: e.target.value })}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Company
          </button>
        </div>
      </form>

      <div className="grid gap-4">
        {companies.map((company: any) => (
          <div key={company.id} className="border p-4 rounded">
            <h2 className="font-bold">{company.name}</h2>
            <p>CNPJ: {company.cnpj}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 