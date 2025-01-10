const ENDPOINT_STORAGE_KEY = "deriv_endpoint_settings";

// Production configuration
export const PROD_CONFIG = {
    APP_ID: '66435',
    WS_URL: 'wss://ws.derivws.com/websockets/v3',
    OAUTH_URL: 'https://oauth.deriv.com'
}

// Development configuration
export const DEV_CONFIG = {
    APP_ID: '9999',
    WS_URL: 'wss://qa47.deriv.dev/websockets/v3',
    OAUTH_URL: 'https://qa47.deriv.dev',
    REDIRECT_URL: 'http://localhost:8443'
}

// Get base configuration with fallback to production values
const getBaseConfig = () => {
    return import.meta.env.DEV ? DEV_CONFIG : PROD_CONFIG;
}

// Get stored endpoint settings if they exist
export const getStoredEndpointSettings = () => {
    const storedSettings = localStorage.getItem(ENDPOINT_STORAGE_KEY);
    if (storedSettings) {
        return JSON.parse(storedSettings);
    }
    return null;
}

// Store endpoint settings
export const setEndpointSettings = (server, appId) => {
    localStorage.setItem(
        ENDPOINT_STORAGE_KEY,
        JSON.stringify({ server, appId })
    );
}

// Clear stored endpoint settings
export const clearEndpointSettings = () => {
    localStorage.removeItem(ENDPOINT_STORAGE_KEY);
}

// Get configuration with custom endpoint support
export const getConfig = () => {
    const baseConfig = getBaseConfig();
    const storedSettings = getStoredEndpointSettings();

    if (storedSettings) {
        const { server, appId } = storedSettings;
        return {
            ...baseConfig,
            APP_ID: appId,
            WS_URL: `wss://${server}/websockets/v3`
        };
    }

    return baseConfig;
}

// Get default server URL (without protocol and path)
export const getDefaultServer = () => {
    const { WS_URL } = getBaseConfig();
    return WS_URL.replace(/^wss?:\/\//, "").replace(/\/websockets\/v3$/, "");
}

// Get default app ID
export const getDefaultAppId = () => {
    return getBaseConfig().APP_ID;
}
