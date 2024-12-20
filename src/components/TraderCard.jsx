import { Text, Button } from "@deriv-com/quill-ui";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import useCopyTradingStats from "../hooks/useCopyTradingStats";

const TraderCard = ({
    trader,
    onCopyClick,
    onStopCopy,
    isProcessing,
    copyFailed,
    onRemove,
}) => {
    const [isCopying, setIsCopying] = useState(false);
    const { stats, isLoading } = useCopyTradingStats(trader.id);

    // Read initial copying status from localStorage
    useEffect(() => {
        const traders = JSON.parse(localStorage.getItem("traders") || "[]");
        const currentTrader = traders.find((t) => t.token === trader.token);
        if (currentTrader) {
            setIsCopying(currentTrader.isCopying);
        }
    }, [trader.token]);

    useEffect(() => {
        if (copyFailed) {
            updateLocalStorage(false);
            setIsCopying(false);
        }
    }, [copyFailed]);

    const updateLocalStorage = (newCopyingStatus) => {
        // Get current traders from localStorage
        const traders = JSON.parse(localStorage.getItem("traders") || "[]");

        // Find and update the specific trader's isCopying status
        const updatedTraders = traders.map((t) => {
            if (t.token === trader.token) {
                return { ...t, isCopying: newCopyingStatus };
            }
            return t;
        });

        // Save back to localStorage
        localStorage.setItem("traders", JSON.stringify(updatedTraders));
        setIsCopying(newCopyingStatus);
    };

    const handleCopyClick = () => {
        updateLocalStorage(true);
        onCopyClick(trader);
    };

    const handleStopCopy = () => {
        updateLocalStorage(false);
        onStopCopy(trader);
    };

    return (
        <div className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                    <Text size="xl" bold className="mb-2">
                        {trader.name}
                    </Text>
                    <Text className="text-green-600 font-medium">
                        {trader.id}
                    </Text>
                </div>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    {isCopying && !copyFailed ? (
                        <Button
                            variant="secondary"
                            onClick={handleStopCopy}
                            disabled={isProcessing}
                            fullWidth
                        >
                            Stop Copying
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={handleCopyClick}
                            disabled={isProcessing}
                            isLoading={isProcessing}
                            fullWidth
                        >
                            {isProcessing ? "Copying..." : "Start Copying"}
                        </Button>
                    )}
                </div>
            </div>

            <div className="border-t pt-4 mb-4">
                {isLoading ? (
                    <Text className="text-center text-gray-500">
                        Loading statistics...
                    </Text>
                ) : stats ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <Text size="sm" className="text-gray-500">
                                Active Since
                            </Text>
                            <Text size="lg" bold>
                                {stats.active_since
                                    ? new Date(
                                          stats.active_since * 1000
                                      ).toLocaleDateString("en-US", {
                                          month: "long",
                                          year: "numeric",
                                      })
                                    : "-"}
                            </Text>
                        </div>
                        <div>
                            <Text size="sm" className="text-gray-500">
                                No. of profitable trades
                            </Text>
                            <Text size="lg" bold>
                                {stats.trades_profitable || 0}
                            </Text>
                        </div>
                        <div>
                            <Text size="sm" className="text-gray-500">
                                No. of copiers
                            </Text>
                            <Text size="lg" bold>
                                {stats.copiers || 0}
                            </Text>
                        </div>
                        <div>
                            <Text size="sm" className="text-gray-500">
                                Total Loss
                            </Text>
                            <Text size="lg" bold className="text-red-500">
                                {stats.avg_loss || 0}
                            </Text>
                        </div>
                        <div>
                            <Text size="sm" className="text-gray-500">
                                Total Profit
                            </Text>
                            <Text size="lg" bold className="text-green-600">
                                {stats.avg_profit || 0}
                            </Text>
                        </div>
                        <div>
                            <Text size="sm" className="text-gray-500">
                                Performance Probability
                            </Text>
                            <Text size="lg" bold>
                                {(
                                    (stats.performance_probability || 0) * 100
                                ).toFixed(1)}
                                %
                            </Text>
                        </div>
                    </div>
                ) : (
                    <Text className="text-center text-gray-500">
                        No statistics available
                    </Text>
                )}
            </div>

            <div className="flex justify-end mt-4">
                <Button
                    variant="secondary"
                    colorStyle="red"
                    onClick={() => onRemove(trader)}
                    disabled={isCopying}
                >
                    ⛌ Delete
                </Button>
            </div>
        </div>
    );
};

TraderCard.propTypes = {
    trader: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        token: PropTypes.string.isRequired,
    }).isRequired,
    onCopyClick: PropTypes.func.isRequired,
    onStopCopy: PropTypes.func.isRequired,
    isProcessing: PropTypes.bool.isRequired,
    copyFailed: PropTypes.bool,
    onRemove: PropTypes.func.isRequired,
};

export default TraderCard;
