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
  companyId: string;
  shiftValue: number;
  bank?: string;
  branch?: string;
  account?: string;
  operation?: string;
  pixKey?: string;
  cpf?: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface WorkerSummary {
  workerId: string;
  workerName: string;
  companyId: string;
  companyName: string;
  numberOfShifts: number;
  shiftValue: number;
  totalPay: number;
}

export interface CompanySummary {
  companyId: string;
  companyName: string;
  workers: WorkerSummary[];
  totalPay: number;
}

export interface UserData {
  id: string;
  email: string;
  name: string;
} 