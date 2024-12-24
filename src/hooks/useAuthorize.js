import { useEffect } from 'react';
import useWebSocket from './useWebSocket';
import useDerivAccounts from './useDerivAccounts';

// Singleton state
let isAuthorizedGlobal = false;
let authErrorGlobal = null;

const useAuthorize = () => {
    const { defaultAccount, clearAccounts } = useDerivAccounts();
    const { isConnected, sendMessage, close } = useWebSocket();

    // Handle authorization
    useEffect(() => {
        if (isConnected && defaultAccount?.token && !isAuthorizedGlobal) {
            console.log('Sending authorize request');
            sendMessage(
                { authorize: defaultAccount.token },
                (response) => {
                    if (response.error) {
                        console.error('Authorization failed:', response.error);
                        authErrorGlobal = response.error;
                        isAuthorizedGlobal = false;
                        clearAccounts();
                        close();
                    } else {
                        console.log('Authorization successful');
                        authErrorGlobal = null;
                        isAuthorizedGlobal = true;
                    }
                }
            );
        }
    }, [isConnected, defaultAccount, sendMessage, clearAccounts, close]);

    // Reset auth state when connection is lost
    useEffect(() => {
        if (!isConnected) {
            isAuthorizedGlobal = false;
        }
    }, [isConnected]);

    return {
        isAuthorized: isAuthorizedGlobal,
        authError: authErrorGlobal,
        isConnected,
    };
};

export default useAuthorize;
