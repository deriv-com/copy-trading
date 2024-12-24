import { createContext, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import useWebSocket from "../hooks/useWebSocket";
import useDerivAccounts from "../hooks/useDerivAccounts";

const AuthContext = createContext(null);

// Singleton state
let isAuthorizedGlobal = false;
let authErrorGlobal = null;

export const AuthProvider = ({ children }) => {
    const { defaultAccount, clearAccounts } = useDerivAccounts();
    const { isConnected, sendMessage, close } = useWebSocket();

    // Handle authorization
    useEffect(() => {
        if (isConnected && defaultAccount?.token && !isAuthorizedGlobal) {
            console.log("Sending authorize request");
            sendMessage({ authorize: defaultAccount.token }, (response) => {
                if (response.error) {
                    console.error("Authorization failed:", response.error);
                    authErrorGlobal = response.error;
                    isAuthorizedGlobal = false;
                    clearAccounts();
                    close();
                } else {
                    console.log("Authorization successful");
                    authErrorGlobal = null;
                    isAuthorizedGlobal = true;
                }
            });
        }
    }, [isConnected, defaultAccount, sendMessage, clearAccounts, close]);

    // Reset auth state when connection is lost
    useEffect(() => {
        if (!isConnected) {
            isAuthorizedGlobal = false;
        }
    }, [isConnected]);

    const value = {
        isAuthorized: isAuthorizedGlobal,
        authError: authErrorGlobal,
        isConnected,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default useAuth;
