'use client';

import { useState, useEffect } from 'react';
import { Worker } from '@/types';
import { api } from '@/lib/api';

interface Company {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  companies: string[];
  shiftValue: number;
  cpf?: string;
  bank?: string;
  branch?: string;
  account?: string;
  operation?: string;
  pixKey?: string;
}

export default function WorkersPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [error, setError] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    companies: [],
    shiftValue: 0,
  });

  // Load companies and workers
  useEffect(() => {
    Promise.all([
      api.companies.list(),
      api.workers.list()
    ]).then(([companiesData, workersData]) => {
      setCompanies(companiesData);
      setWorkers(workersData);
    }).catch(err => {
      console.error('Error loading data:', err);
      setError('Erro ao carregar dados');
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.name || !formData.shiftValue || formData.companies.length === 0) {
        setError('Nome, valor do plantão e pelo menos uma empresa são obrigatórios');
        return;
      }

      const response = await api.workers.create(formData);
      if (response) {
        const updatedWorkers = await api.workers.list();
        setWorkers(updatedWorkers);
        setFormData({
          name: '',
          companies: [],
          shiftValue: 0,
        });
      }
    } catch (error) {
      console.error('Error creating worker:', error);
      setError('Erro ao salvar funcionário');
    }
  };

  const handleEdit = (worker: Worker) => {
    setEditingId(worker.id);
    setFormData({
      name: worker.name,
      companies: worker.companies || [],
      shiftValue: worker.shiftValue,
      cpf: worker.cpf || '',
      bank: worker.bank || '',
      branch: worker.branch || '',
      account: worker.account || '',
      operation: worker.operation || '',
      pixKey: worker.pixKey || '',
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      companies: [],
      shiftValue: 0,
    });
    setError('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este funcionário?')) {
      return;
    }

    try {
      const response = await api.workers.delete(id);
      if (response) {
        const updatedWorkers = await api.workers.list();
        setWorkers(updatedWorkers);
      }
    } catch (error) {
      console.error('Error deleting worker:', error);
      setError('Erro ao excluir funcionário');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {editingId ? 'Editar Funcionário' : 'Cadastro de Funcionários'}
      </h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Form */}
      <div className="grid grid-cols-1 gap-6 mb-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Nome do funcionário"
            />
          </div>

          <div>
            <label htmlFor="companies" className="block text-sm font-medium text-gray-700 mb-1">Empresas</label>
            <div className="space-y-2">
              {companies.map(company => (
                <label key={company.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.companies.includes(company.id)}
                    onChange={(e) => {
                      const newCompanies = e.target.checked
                        ? [...formData.companies, company.id]
                        : formData.companies.filter(id => id !== company.id);
                      setFormData({ ...formData, companies: newCompanies });
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{company.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="shiftValue" className="block text-sm font-medium text-gray-700 mb-1">Valor do Plantão</label>
            <input
              type="number"
              id="shiftValue"
              name="shiftValue"
              value={formData.shiftValue}
              onChange={(e) => setFormData({ ...formData, shiftValue: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded"
              placeholder="R$ 0,00"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf || ''}
              onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
            <input
              type="text"
              id="bank"
              name="bank"
              value={formData.bank || ''}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Nome do banco"
            />
          </div>

          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">Agência</label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch || ''}
              onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="0000"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">Conta</label>
            <input
              type="text"
              id="account"
              name="account"
              value={formData.account || ''}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="00000-0"
            />
          </div>

          <div>
            <label htmlFor="operation" className="block text-sm font-medium text-gray-700 mb-1">Operação</label>
            <input
              type="text"
              id="operation"
              name="operation"
              value={formData.operation || ''}
              onChange={(e) => setFormData({ ...formData, operation: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Ex: 013"
            />
          </div>

          <div>
            <label htmlFor="pixKey" className="block text-sm font-medium text-gray-700 mb-1">Chave PIX</label>
            <input
              type="text"
              id="pixKey"
              name="pixKey"
              value={formData.pixKey || ''}
              onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="CPF, email, telefone ou chave aleatória"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingId ? 'Salvar Alterações' : 'Adicionar Funcionário'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Workers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-4 font-medium">NOME</th>
              <th className="text-left p-4 font-medium">EMPRESAS</th>
              <th className="text-left p-4 font-medium">VALOR DO PLANTÃO</th>
              <th className="text-left p-4 font-medium">CPF</th>
              <th className="text-left p-4 font-medium">DADOS BANCÁRIOS</th>
              <th className="text-left p-4 font-medium">AÇÕES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {workers.map((worker) => (
              <tr key={worker.id} className="hover:bg-gray-50">
                <td className="p-4">{worker.name}</td>
                <td className="p-4">{worker.companyNames?.join(', ')}</td>
                <td className="p-4">
                  {worker.shiftValue.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </td>
                <td className="p-4">{worker.cpf || '-'}</td>
                <td className="p-4">
                  {worker.bank ? (
                    <>
                      {worker.bank} / Ag: {worker.branch} / CC: {worker.account}
                      {worker.operation && ` / Op: ${worker.operation}`}
                      {worker.pixKey && <div className="text-sm text-gray-500">PIX: {worker.pixKey}</div>}
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-4">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(worker)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(worker.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 