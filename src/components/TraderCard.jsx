import { Text, Button } from "@deriv-com/quill-ui";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import useCopyTradingStats from "../hooks/useCopyTradingStats";

const TraderCard = ({ trader, onCopyClick, onStopCopy, isProcessing }) => {
    const [isCopying, setIsCopying] = useState(false);
    const { stats, isLoading } = useCopyTradingStats(trader.token);

    // Read initial copying status from localStorage
    useEffect(() => {
        const traders = JSON.parse(localStorage.getItem("traders") || "[]");
        const currentTrader = traders.find((t) => t.token === trader.token);
        if (currentTrader) {
            setIsCopying(currentTrader.isCopying);
        }
    }, [trader.token]);

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
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <Text size="xl" bold className="mb-2">
                        {trader.name}
                    </Text>
                    <Text className="text-green-600 font-medium">
                        {trader.id}
                    </Text>
                </div>
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                    <Button variant="secondary" color="black" fullWidth>
                        View Details
                    </Button>
                    {isCopying ? (
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
};

export default TraderCard;
