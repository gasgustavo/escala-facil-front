'use client';

import { useState, useEffect } from 'react';
import { Company } from '@/types';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CompanyRegistration() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await api.companies.list();
      console.log('data', data)
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newCompanyName.trim()) {
      setError('Company name is required');
      return;
    }

    try {
      const response = await api.companies.create({ name: newCompanyName });
      if (response) {
        const updatedCompanies = await api.companies.list();
        setCompanies(updatedCompanies);
        setNewCompanyName('');
        setSuccess('Company created successfully!');
      }
    } catch (error) {
      setError('Error creating company');
      console.error('Error creating company:', error);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setSuccess(null);

    try {
      const response = await api.companies.delete(id);
      if (response) {
        const updatedCompanies = await api.companies.list();
        setCompanies(updatedCompanies);
        setSuccess('Company deleted successfully!');
      }
    } catch (error) {
      setError('Error deleting company');
      console.error('Error deleting company:', error);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Cadastro de Empresas</h1>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              placeholder="Digite o nome da empresa"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Adicionar Empresa
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
} 