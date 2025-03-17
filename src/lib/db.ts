import { BlobServiceClient } from '@azure/storage-blob';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import os from 'os';

const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'database-container';
const blobName = 'escala-facil.db';
const localDbPath = path.join(os.tmpdir(), 'escala-facil.db');

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING || ''
);

const containerClient = blobServiceClient.getContainerClient(containerName);
const blobClient = containerClient.getBlockBlobClient(blobName);

async function downloadDatabase() {
  try {
    // Create container if it doesn't exist
    await containerClient.createIfNotExists();
    
    try {
      await blobClient.downloadToFile(localDbPath);
    } catch (error: unknown) {
      if ((error as any).statusCode === 404) {
        // Create new database if it doesn't exist
        const db = new Database(localDbPath);
        await initializeDatabase(db);
        db.close();
        
        // Upload the new database
        await uploadDatabase();
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error accessing Azure Blob Storage:', error);
    throw error;
  }
}

async function uploadDatabase() {
  const fileStream = fs.createReadStream(localDbPath);
  await blobClient.uploadStream(fileStream);
}

async function initializeDatabase(db: Database.Database) {
  // Companies table
  db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      userId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Workers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS workers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      shiftValue REAL NOT NULL,
      bank TEXT,
      branch TEXT,
      account TEXT,
      operation TEXT,
      pixKey TEXT,
      cpf TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Company Workers junction table
  db.exec(`
    CREATE TABLE IF NOT EXISTS company_workers (
      companyId TEXT NOT NULL,
      workerId TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (companyId, workerId),
      FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE,
      FOREIGN KEY (workerId) REFERENCES workers(id) ON DELETE CASCADE
    )
  `);

  // Shifts table
  db.exec(`
    CREATE TABLE IF NOT EXISTS shifts (
      id TEXT PRIMARY KEY,
      workerId TEXT NOT NULL,
      companyId TEXT NOT NULL,
      date DATE NOT NULL,
      type TEXT CHECK(type IN ('DAY', 'NIGHT')) NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (workerId) REFERENCES workers(id),
      FOREIGN KEY (companyId) REFERENCES companies(id)
    )
  `);

  // Add default companies and workers for development
  const defaultCompanies = [
    {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Hospital Santa Casa',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Hospital São Lucas',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'UPA Centro',
    }
  ];

  const defaultUserId = 'mock-user-id';
  const now = new Date().toISOString();

  // Add default companies
  const insertCompany = db.prepare(
    'INSERT OR IGNORE INTO companies (id, name, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)'
  );

  for (const company of defaultCompanies) {
    insertCompany.run(company.id, company.name, defaultUserId, now, now);
  }

  // Add default workers
  const workers = [
    {
      id: '660e8400-e29b-41d4-a716-446655440001',
      name: 'Dr. João Silva',
      shiftValue: 1500.0,
      cpf: '123.456.789-00',
      companies: [defaultCompanies[0].id, defaultCompanies[1].id] // Works at Santa Casa and São Lucas
    },
    {
      id: '770e8400-e29b-41d4-a716-446655440002',
      name: 'Dra. Maria Santos',
      shiftValue: 1500.0,
      cpf: '987.654.321-00',
      companies: [defaultCompanies[0].id, defaultCompanies[2].id] // Works at Santa Casa and UPA
    },
    {
      id: '880e8400-e29b-41d4-a716-446655440003',
      name: 'Dr. Pedro Oliveira',
      shiftValue: 1200.0,
      cpf: '456.789.123-00',
      companies: [defaultCompanies[1].id, defaultCompanies[2].id] // Works at São Lucas and UPA
    }
  ];

  const insertWorker = db.prepare(
    'INSERT OR IGNORE INTO workers (id, name, shiftValue, cpf, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const linkWorkerToCompany = db.prepare(
    'INSERT OR IGNORE INTO company_workers (companyId, workerId) VALUES (?, ?)'
  );

  for (const worker of workers) {
    insertWorker.run(worker.id, worker.name, worker.shiftValue, worker.cpf, now, now);
    for (const companyId of worker.companies) {
      linkWorkerToCompany.run(companyId, worker.id);
    }
  }
}

export async function getDatabase(): Promise<Database.Database> {
  let db: Database.Database;
  
  try {
    await downloadDatabase();
    db = new Database(localDbPath);
    await initializeDatabase(db);
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function closeDatabase(db: Database.Database) {
  db.close();
  await uploadDatabase();
} 