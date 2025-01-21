import { useState } from "react";
import PropTypes from "prop-types";
import { ToggleSwitch, Text, SectionMessage } from "@deriv-com/quill-ui";

const Settings = ({ settings, updateSettings, onChangeSettings }) => {
    const [allowCopiers, setAllowCopiers] = useState(
        settings?.allow_copiers ?? false
    );

    const handleTraderToggle = async () => {
        try {
            await updateSettings({ allow_copiers: !allowCopiers ? 1 : 0 });
            setAllowCopiers(!allowCopiers);
            onChangeSettings?.();
        } catch (error) {
            console.error("Failed to update trader status:", error);
        }
    };

    return (
        <div className="p-8 bg-white h-full space-y-8">
            <Text as="h2" size="xl" bold>
                Settings
            </Text>
            <div>
                <div className="flex items-center justify-between gap-16">
                    <div className="space-y-2">
                        <Text as="h3" size="lg" bold>
                            Trader Mode
                        </Text>
                        <Text size="sm" color="secondary">
                            Enable this to allow others to copy your trades.
                            Disable this to become a copy.
                        </Text>
                    </div>
                    <ToggleSwitch
                        checked={allowCopiers}
                        onChange={handleTraderToggle}
                        size="lg"
                    />
                </div>
                <div className="mt-4">
                    <SectionMessage
                        message="Upon disabling, others won't be able to copy you and all your active copiers will be dropped without any notification."
                        size="sm"
                        status="warning"
                        title="Caution"
                    />
                </div>
            </div>
        </div>
    );
};

Settings.propTypes = {
    settings: PropTypes.shape({
        allow_copiers: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    }),
    updateSettings: PropTypes.func.isRequired,
    onChangeSettings: PropTypes.func,
};

export default Settings;
