import { useEffect, useState } from 'react';
import useWebSocket from './useWebSocket';
import useDerivAccounts from './useDerivAccounts';

const useAuthorize = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authError, setAuthError] = useState(null);
    const { defaultAccount, clearAccounts } = useDerivAccounts();
    const { isConnected, sendMessage, close } = useWebSocket();

    // Handle authorization
    useEffect(() => {
        if (isConnected && defaultAccount?.token && !isAuthorized) {
            console.log('Sending authorize request');
            sendMessage(
                { authorize: defaultAccount.token },
                (response) => {
                    if (response.error) {
                        console.error('Authorization failed:', response.error);
                        setAuthError(response.error);
                        setIsAuthorized(false);
                        clearAccounts();
                        close();
                    } else {
                        console.log('Authorization successful');
                        setAuthError(null);
                        setIsAuthorized(true);
                    }
                }
            );
        }
    }, [isConnected, defaultAccount, sendMessage, clearAccounts, close, isAuthorized]);

    // Reset auth state when connection is lost
    useEffect(() => {
        if (!isConnected) {
            setIsAuthorized(false);
        }
    }, [isConnected]);

    return {
        isAuthorized,
        authError,
        isConnected,
    };
};

export default useAuthorize;
