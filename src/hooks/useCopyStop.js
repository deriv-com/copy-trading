import { useState } from "react";
import useWebSocket from "./useWebSocket";
import useAuthorize from "./useAuthorize";

const useCopyStop = () => {
    const { sendMessage, isConnected } = useWebSocket();
    const { isAuthorized } = useAuthorize();
    const [processingTrader, setProcessingTrader] = useState(null);

    const stopCopyTrading = (trader, onSuccess, onError) => {
        if (!isConnected || !isAuthorized) {
            onError("Connection not ready. Please try again.");
            return;
        }

        setProcessingTrader(trader);
        sendMessage({ copy_stop: trader.token }, (response) => {
            if (response.error) {
                onError(response.error.message || "Error stopping copy trade");
            } else {
                onSuccess(trader);
            }
            setProcessingTrader(null);
        });
    };

    return {
        stopCopyTrading,
        processingTrader
    };
};

export default useCopyStop;
