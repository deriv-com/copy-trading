import { Text, Button } from "@deriv-com/quill-ui";
import PropTypes from "prop-types";

const TraderCard = ({
    trader,
    onCopyClick,
    onStopCopy,
    isCopying,
    isProcessing,
}) => {
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
                            onClick={() => onStopCopy(trader)}
                            disabled={isProcessing}
                            fullWidth
                        >
                            Stop Copying
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            onClick={() => onCopyClick(trader)}
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
    }).isRequired,
    onCopyClick: PropTypes.func.isRequired,
    onStopCopy: PropTypes.func.isRequired,
    isCopying: PropTypes.bool.isRequired,
    isProcessing: PropTypes.bool.isRequired,
};

export default TraderCard;
