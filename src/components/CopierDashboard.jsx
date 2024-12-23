import { useEffect, useState } from "react";
import { Text, Snackbar } from "@deriv-com/quill-ui";
import useDerivWebSocket from "../hooks/useDerivWebSocket";
import useCopyTradersList from "../hooks/useCopyTradersList";
import AddTraderForm from "./AddTraderForm";
import TraderCard from "./TraderCard";

const CopierDashboard = () => {
    const { sendRequest, wsResponse } = useDerivWebSocket();
    const {
        traders: apiTraders,
        isLoading,
        error,
        refreshList,
    } = useCopyTradersList();

    useEffect(() => {
        console.log("CopierDashboard - Traders:", {
            apiTraders,
            isLoading,
            error,
        });
    }, [apiTraders, isLoading, error]);
    const [processingTrader, setProcessingTrader] = useState(null);
    const [copiedTrader, setCopiedTrader] = useState(null);
    const [failedCopyTrader, setFailedCopyTrader] = useState(null);
    const [snackbar, setSnackbar] = useState({
        isVisible: false,
        message: "",
        status: "neutral",
    });

    useEffect(() => {
        if (!wsResponse || !processingTrader) return;

        const handleResponse = () => {
            console.log("WebSocket Response:", wsResponse);
            console.log("Processing Trader:", processingTrader);

            if (wsResponse.msg_type === "copy_start") {
                if (wsResponse.error) {
                    console.log(
                        "Showing error snackbar:",
                        wsResponse.error.message
                    );
                    setSnackbar({
                        isVisible: true,
                        message:
                            wsResponse.error.message ||
                            "Error starting copy trade",
                        status: "fail",
                    });
                    setFailedCopyTrader(processingTrader);
                    setProcessingTrader(null);
                } else {
                    const trader = processingTrader;
                    console.log(
                        "Showing success snackbar for trader:",
                        trader.name
                    );
                    setCopiedTrader(trader);
                    setProcessingTrader(null);
                    setSnackbar({
                        isVisible: true,
                        message: `Successfully started copying ${trader.name}`,
                        status: "neutral",
                    });
                }
            } else if (wsResponse.msg_type === "copy_stop") {
                if (wsResponse.error) {
                    setSnackbar({
                        isVisible: true,
                        message:
                            wsResponse.error.message ||
                            "Error stopping copy trade",
                        status: "fail",
                    });
                    setProcessingTrader(null);
                } else {
                    const trader = processingTrader;
                    setCopiedTrader(null);
                    setProcessingTrader(null);
                    setSnackbar({
                        isVisible: true,
                        message: `Stopped copying ${trader.name}`,
                        status: "neutral",
                    });
                    // Refresh traders list after successfully stopping copy trading
                    refreshList();
                }
            }
        };

        handleResponse();
    }, [wsResponse]);

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, isVisible: false }));
    };

    const handleCopyClick = (trader) => {
        console.log("Copy clicked for trader:", trader);
        setProcessingTrader(trader);
        sendRequest({
            copy_start: trader.token,
        });
    };

    const handleStopCopy = (trader) => {
        console.log("Stop copy clicked for trader:", trader);
        setProcessingTrader(trader);
        sendRequest({
            copy_stop: trader.token,
        });
    };

    const handleAddTrader = (trader) => {
        console.log("New trader added:", trader);
        // Refresh the traders list from API
        refreshList();
    };

    const handleRemoveTrader = (trader) => {
        // Show feedback
        setSnackbar({
            isVisible: true,
            message: `Removed ${trader.name}`,
            status: "neutral",
        });
        // Refresh the traders list from API
        refreshList();
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <Text size="3xl" bold className="mb-4">
                    Copy Trading Dashboard
                </Text>
                <Text size="lg" className="text-gray-600">
                    Available traders to copy
                </Text>
            </div>

            <AddTraderForm onAddTrader={handleAddTrader} />

            {isLoading ? (
                <div className="text-center py-8">Loading traders...</div>
            ) : error ? (
                <div className="text-center py-8 text-red-600">
                    Error loading traders: {error}
                </div>
            ) : !apiTraders?.length ? (
                <div className="text-center py-8">No traders available</div>
            ) : (
                <div className="grid gap-6">
                    {apiTraders.map((trader) => (
                        <TraderCard
                            key={trader.loginid}
                            trader={{
                                id: trader.loginid,
                                name: trader.name || `Trader ${trader.loginid}`,
                                token: trader.token,
                                isCopying: trader.is_copying,
                            }}
                            onCopyClick={handleCopyClick}
                            onStopCopy={handleStopCopy}
                            isCopying={copiedTrader?.id === trader.id}
                            isProcessing={processingTrader?.id === trader.id}
                            copyFailed={failedCopyTrader?.id === trader.id}
                            onRemove={handleRemoveTrader}
                        />
                    ))}
                </div>
            )}

            <div className="fixed top-0 left-0 right-0 flex justify-center pt-4 z-50">
                <Snackbar
                    isVisible={snackbar.isVisible}
                    message={snackbar.message}
                    status={snackbar.status}
                    hasCloseButton={true}
                    onCloseAction={handleSnackbarClose}
                    standalone={true}
                />
            </div>
        </div>
    );
};

export default CopierDashboard;
