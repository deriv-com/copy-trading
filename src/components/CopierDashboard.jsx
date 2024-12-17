import { useEffect, useState } from "react";
import { Text, Button, useSnackbar, Snackbar } from "@deriv-com/quill-ui";
import useDerivWebSocket from "../hooks/useDerivWebSocket";
import useCopyTradersList from "../hooks/useCopyTradersList";
import AddTraderForm from "./AddTraderForm";

const TraderCard = ({
    trader,
    onCopyClick,
    onStopCopy,
    isCopying,
    isProcessing,
}) => {
    return (
        <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <Text size="xl" bold className="mb-2">
                        {trader.name}
                    </Text>
                    <Text className="text-green-600 font-medium">
                        {trader.profit}
                    </Text>
                </div>
                {isCopying ? (
                    <Button
                        variant="secondary"
                        onClick={() => onStopCopy(trader)}
                        disabled={isProcessing}
                    >
                        Stop Copying
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        onClick={() => onCopyClick(trader)}
                        disabled={isProcessing}
                        isLoading={isProcessing}
                    >
                        {isProcessing ? "Copying..." : "Copy Trader"}
                    </Button>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <Text size="sm" className="text-gray-500">
                        Total Trades
                    </Text>
                    <Text bold>{trader.trades}</Text>
                </div>
                <div>
                    <Text size="sm" className="text-gray-500">
                        Success Rate
                    </Text>
                    <Text bold>{trader.success_rate}</Text>
                </div>
            </div>
        </div>
    );
};

const CopierDashboard = () => {
    const { sendRequest, wsResponse } = useDerivWebSocket();
    const {
        traders,
        isLoading: isLoadingTraders,
        error: tradersError,
    } = useCopyTradersList();
    const [processingTrader, setProcessingTrader] = useState(null);
    const [copiedTrader, setCopiedTrader] = useState(null);
    const [snackbar, setSnackbar] = useState({
        isVisible: false,
        message: "",
        status: "neutral",
    });

    useEffect(() => {
        console.log("Available traders:", traders);
    }, [traders]);

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

    const handleAddTrader = (traderId) => {
        console.log("New trader added:", traderId);
        // You can add additional logic here if needed
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <Text size="3xl" bold className="mb-4">
                    Copy Trading Dashboard
                </Text>
                <Text size="lg" className="text-gray-600">
                    Find and copy successful traders to automate your trading
                    strategy.
                </Text>
            </div>

            <AddTraderForm onAddTrader={handleAddTrader} />

            {isLoadingTraders ? (
                <div className="text-center py-8">Loading traders...</div>
            ) : tradersError ? (
                <div className="text-center py-8 text-red-600">
                    {tradersError}
                </div>
            ) : (
                <div className="grid gap-6">
                    {traders.map((trader, index) => (
                        <TraderCard
                            key={trader.id || index}
                            trader={trader}
                            onCopyClick={handleCopyClick}
                            onStopCopy={handleStopCopy}
                            isCopying={copiedTrader?.token === trader.token}
                            isProcessing={
                                processingTrader?.token === trader.token
                            }
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
