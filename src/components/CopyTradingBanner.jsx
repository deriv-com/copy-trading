import { Text, Button } from "@deriv-com/quill-ui";
import { DerivLightTrustedPartnershipIcon } from "@deriv/quill-icons";
import PropTypes from "prop-types";

const CopyTradingBanner = ({ onGetStarted }) => {
    return (
        <div className="mb-6">
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="flex-shrink-0">
                        <DerivLightTrustedPartnershipIcon
                            height="120px"
                            width="120px"
                        />
                    </div>
                    <div className="flex flex-col gap-4 w-fit">
                        <Text size="xl" bold>
                            Copy Trading
                        </Text>
                        <Text className="text-gray-600">
                            Start copying successful traders and earn while they
                            trade.
                        </Text>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={onGetStarted}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

CopyTradingBanner.propTypes = {
    onGetStarted: PropTypes.func.isRequired,
};

export default CopyTradingBanner;
