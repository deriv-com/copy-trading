import { Text } from "@deriv-com/quill-ui";
import { LegacyCloseCircle1pxRedIcon } from "@deriv/quill-icons";
import PropTypes from "prop-types";

const ErrorMessage = ({ message }) => {
    return (
        <div className="mb-6 border-2 border-red-600 rounded-lg p-2">
            <div className="flex items-center gap-2">
                <LegacyCloseCircle1pxRedIcon fill="#ff0044" iconSize="xs" />
                <Text size="sm" color="text-red-600">
                    {message}
                </Text>
            </div>
        </div>
    );
};

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
};

export default ErrorMessage;
