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
      const response = await fetch('/api/companies', {
        headers: {
          'x-user-id': 'mock-user-id', // This will be replaced with the actual user ID from Azure AD B2C
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar empresas');
      }

      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      setError('Erro ao carregar empresas');
      console.error('Erro:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!newCompanyName.trim()) {
      setError('O nome da empresa é obrigatório');
      return;
    }

    try {
      const response = await api.companies.create({ name: newCompanyName });
      if (response) {
        const updatedCompanies = await api.companies.list();
        setCompanies(updatedCompanies);
        setNewCompanyName('');
        setSuccess('Empresa criada com sucesso!');
      }
    } catch (error) {
      setError('Erro ao criar empresa');
      console.error('Error creating company:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta empresa?')) {
      return;
    }

    try {
      const response = await api.companies.delete(id);
      if (response) {
        const updatedCompanies = await api.companies.list();
        setCompanies(updatedCompanies);
        setSuccess('Empresa excluída com sucesso!');
      }
    } catch (error) {
      setError('Erro ao excluir empresa');
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
              placeholder="Nome da empresa"
              className="flex-1 p-2 border border-gray-300 rounded"
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

        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left py-3 px-4 font-semibold">Nome</th>
                <th className="text-left py-3 px-4 font-semibold">Data de Criação</th>
                <th className="text-right py-3 px-4 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{company.name}</td>
                  <td className="py-3 px-4">
                    {new Date(company.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {companies.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-gray-500">
                    Nenhuma empresa cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
} 