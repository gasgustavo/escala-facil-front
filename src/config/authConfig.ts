export const msalConfig = {
    auth: {
        clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID || "",
        authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}`,
        redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || "http://localhost:3000",
        postLogoutRedirectUri: "http://localhost:3000",
        navigateToLoginRequestUrl: true
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: true
    }
};

export const loginRequest = {
    scopes: [
        "api://8a744b69-107f-4d9f-a3f8-a506c4024b75/access_as_user",
        "User.Read"
    ]
}; 