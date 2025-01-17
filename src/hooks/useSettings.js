import { useState, useEffect, useCallback, useRef } from 'react';
import useWebSocket from './useWebSocket';
import { useAuth } from '../hooks/useAuth.jsx';

const useSettings = () => {
    const [settings, setSettings] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthorized, isConnected } = useAuth();
    const { sendMessage } = useWebSocket();
    const hasInitialFetch = useRef(false);

    const fetchSettings = useCallback(() => {
        if (!isConnected || !isAuthorized || hasInitialFetch.current) {
            return;
        }

        setIsLoading(true);
        console.log('Fetching user settings');
        hasInitialFetch.current = true;
        sendMessage(
            { get_settings: 1 },
            (response) => {
                if (response.error) {
                    console.error('Failed to fetch settings:', response.error);
                    setError(response.error);
                } else {
                    console.log('Settings received:', response.get_settings);
                    setSettings(response.get_settings);
                    setError(null);
                }
                setIsLoading(false);
            }
        );
    }, [isConnected, isAuthorized, sendMessage]);

    // Fetch settings on mount and when connection/auth state changes
    useEffect(() => {
        if (isConnected && isAuthorized) {
            fetchSettings();
        }
    }, [isConnected, isAuthorized, fetchSettings]);

    // Reset settings and fetch flag when connection is lost
    useEffect(() => {
        if (!isConnected) {
            setSettings(null);
            setIsLoading(true);
            hasInitialFetch.current = false;
        }
    }, [isConnected]);

    const updateSettings = useCallback(async (newSettings) => {
        if (!isConnected || !isAuthorized) {
            throw new Error('Not connected or authorized');
        }

        // Add debounce to prevent rapid settings updates
        const now = Date.now();
        if (updateSettings.lastCall && now - updateSettings.lastCall < 1000) {
            throw new Error('Please wait before updating settings again');
        }
        updateSettings.lastCall = now;

        return new Promise((resolve, reject) => {
            sendMessage(
                { set_settings: 1, ...newSettings },
                (response) => {
                    if (response.error) {
                        console.error('Failed to update settings:', response.error);
                        setError(response.error);
                        reject(response.error);
                    } else {
                        console.log('Settings updated:', response.set_settings);
                        // After successful update, reset fetch flag and get fresh settings
                        hasInitialFetch.current = false;
                        fetchSettings();
                        resolve(response.set_settings);
                    }
                }
            );
        });
    }, [isConnected, isAuthorized, sendMessage]);

    return {
        settings,
        error,
        isLoading,
        updateSettings,
        fetchSettings
    };
};

export default useSettings;
