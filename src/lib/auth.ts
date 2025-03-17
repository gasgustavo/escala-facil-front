import { Configuration, LogLevel } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: `https://${process.env.NEXT_PUBLIC_AZURE_B2C_TENANT}.b2clogin.com/${process.env.NEXT_PUBLIC_AZURE_B2C_TENANT}.onmicrosoft.com/${process.env.NEXT_PUBLIC_AZURE_B2C_POLICY}`,
    knownAuthorities: [`${process.env.NEXT_PUBLIC_AZURE_B2C_TENANT}.b2clogin.com`],
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
    postLogoutRedirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(message);
        }
      },
      logLevel: LogLevel.Error,
    }
  }
};

export const loginRequest = {
  scopes: ['openid', 'profile', 'offline_access'],
};

export const protectedResources = {
  api: {
    endpoint: '/api',
    scopes: [`https://${process.env.NEXT_PUBLIC_AZURE_B2C_TENANT}.onmicrosoft.com/api/user.read`],
  },
}; 