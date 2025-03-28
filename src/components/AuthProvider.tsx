'use client';

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "@/config/authConfig"
import { useEffect, useState } from "react";

const msalInstance = new PublicClientApplication(msalConfig);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        msalInstance.initialize().then(() => {
            setIsInitialized(true);
        });
    }, []);

    if (!isInitialized) {
        return <div>Initializing authentication...</div>;
    }

    return (
        <MsalProvider instance={msalInstance}>
            {children}
        </MsalProvider>
    );
} 