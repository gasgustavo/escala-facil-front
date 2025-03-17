export interface Company {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Worker {
  id: string;
  name: string;
  shiftValue: number;
  bank?: string;
  branch?: string;
  account?: string;
  operation?: string;
  pixKey?: string;
  cpf?: string;
  createdAt: Date;
  updatedAt: Date;
  companies?: string[]; // Array of company IDs
  companyNames?: string[];
}

export interface Shift {
  id: string;
  workerId: string;
  companyId: string;
  date: Date;
  type: 'DAY' | 'NIGHT';
  createdAt: Date;
  updatedAt: Date;
} 