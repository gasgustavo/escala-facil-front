import { NextApiRequest, NextApiResponse } from 'next';
import { ConfidentialClientApplication } from '@azure/msal-node';

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_CLIENT_ID || '',
    authority: `https://${process.env.AZURE_B2C_TENANT}.b2clogin.com/${process.env.AZURE_B2C_TENANT}.onmicrosoft.com/${process.env.AZURE_B2C_POLICY}`,
    clientSecret: process.env.AZURE_CLIENT_SECRET,
  }
};

const msalClient = new ConfidentialClientApplication(msalConfig);

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export async function validateToken(
  req: AuthenticatedRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const result = await msalClient.acquireTokenByClientCredential({
      scopes: [`https://${process.env.AZURE_B2C_TENANT}.onmicrosoft.com/api/.default`],
    });

    if (!result) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // In a real application, you would validate the token and extract user information
    // For now, we'll use a mock user
    req.user = {
      id: 'mock-user-id',
      email: 'user@example.com',
      name: 'Mock User',
    };

    await next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ error: 'Erro de autenticação' });
  }
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    await validateToken(req, res, async () => {
      await handler(req, res);
    });
  };
} 