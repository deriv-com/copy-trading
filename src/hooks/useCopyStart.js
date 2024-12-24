import { useState } from "react";
import useWebSocket from "./useWebSocket";
import useAuth from "../contexts/AuthContext";

const useCopyStart = () => {
    const { sendMessage } = useWebSocket();
    const { isAuthorized, isConnected } = useAuth();
    const [processingTrader, setProcessingTrader] = useState(null);

    const startCopyTrading = (trader, onSuccess, onError) => {
        if (!isConnected || !isAuthorized) {
            onError("Connection not ready. Please try again.");
            return;
        }

        setProcessingTrader(trader);
        sendMessage({ copy_start: trader.token }, (response) => {
            if (response.error) {
                onError(response.error.message || "Error starting copy trade");
            } else {
                onSuccess(trader);
            }
            setProcessingTrader(null);
        });
    };

    return {
        startCopyTrading,
        processingTrader
    };
};

export default useCopyStart;
