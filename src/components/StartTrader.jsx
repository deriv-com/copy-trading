import { Button, Text } from "@deriv-com/quill-ui";
import { DerivLightTradeInAnyDirectionIcon } from "@deriv/quill-icons";
import PropTypes from "prop-types";

const StartTrader = ({ onStartTrading, disabled = false }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="flex items-center gap-8">
                <div className="flex-shrink-0">
                    <DerivLightTradeInAnyDirectionIcon
                        height="120px"
                        width="120px"
                    />
                </div>
                <div className="flex flex-col gap-4 w-fit">
                    <Text size="xl" bold>
                        Become a Trader
                    </Text>
                    <Text className="text-gray-600">
                        Allow others to copy your strategy by becoming a trader.
                    </Text>
                    <Button
                        onClick={onStartTrading}
                        variant="primary"
                        size="lg"
                        disabled={disabled}
                    >
                        Start Trading
                    </Button>
                </div>
            </div>
        </div>
    );
};

StartTrader.propTypes = {
    onStartTrading: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

export default StartTrader;
