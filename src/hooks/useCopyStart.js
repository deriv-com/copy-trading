import { useState } from "react";
import useWebSocket from "./useWebSocket";
import useAuthorize from "./useAuthorize";

const useCopyStart = () => {
    const { sendMessage, isConnected } = useWebSocket();
    const { isAuthorized } = useAuthorize();
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
