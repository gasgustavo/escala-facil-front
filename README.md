# Escala Fácil Frontend

A modern web application for managing work schedules, built with Next.js, TypeScript, and Azure services.

## Project Overview

Escala Fácil is a web application designed to simplify work schedule management. The application is built using modern web technologies and integrates with Azure services for authentication and storage.

### Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Geist UI
- **Authentication**: Azure AD (MSAL)
- **Storage**: Azure Blob Storage
- **Database**: SQLite (better-sqlite3)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn package manager
- Azure account (for authentication and storage services)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/escala-facil-front.git
cd escala-facil-front
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   - Copy `.env.development` to `.env.local`
   - Update the environment variables with your Azure configuration:
     - `NEXT_PUBLIC_AZURE_AD_CLIENT_ID`
     - `NEXT_PUBLIC_AZURE_AD_TENANT_ID`
     - `AZURE_STORAGE_CONNECTION_STRING`
     - Other required environment variables as specified in `.env.development`

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/           # Next.js app directory (pages and layouts)
├── lib/           # Utility functions and shared logic
├── types/         # TypeScript type definitions
└── types.ts       # Global type definitions
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code linting

## Azure Integration

This project uses several Azure services:

1. **Azure AD Authentication**
   - Uses MSAL (Microsoft Authentication Library) for user authentication
   - Supports both browser and Node.js environments

2. **Azure Blob Storage**
   - Used for file storage and management
   - Requires proper connection string configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

1. Initial Access:
   User visits /empresas → ProtectedRoute checks auth status

2. If Not Authenticated:
   - ProtectedRoute triggers login()
   - Redirects to /login
   - staticwebapp.config.json rewrites to /.auth/login/aad
   - Azure AD login page appears

3. After Successful Login:
   - Azure AD redirects back to your app
   - Azure Static Web Apps creates a session
   - User is redirected to original page

4. Subsequent Requests:
   - /.auth/me endpoint returns user info
   - AuthProvider updates isAuthenticated state
   - Protected content is displayed