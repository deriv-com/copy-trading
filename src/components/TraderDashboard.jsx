import useSettings from "../hooks/useSettings";
import useCopyTradersList from "../hooks/useCopyTradersList";
import TraderStatistics from "./TraderStatistics";
import TraderBanner from "./TraderBanner";
import TokenManagement from "./TokenManagement";
import Settings from "./Settings";
import { Spinner, SectionMessage } from "@deriv-com/quill-ui";
import { useState } from "react";
import TraderDesktopNavigation from "./TraderDesktopNavigation";
import TraderMobileNavigation from "./TraderMobileNavigation";

const TraderDashboard = () => {
    const {
        settings,
        isLoading: settingsLoading,
        updateSettings,
        fetchSettings,
    } = useSettings();
    const { traders, isLoading: tradersLoading } = useCopyTradersList();
    const [selectedMenu, setSelectedMenu] = useState("statistics");

    const handleStartTrading = async () => {
        try {
            await updateSettings({ allow_copiers: 1 });
            fetchSettings();
        } catch (error) {
            console.error("Failed to update settings:", error);
        }
    };

    if (settingsLoading || tradersLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {settings?.allow_copiers ? (
                <div className="flex flex-col md:flex-row gap-6">
                    <TraderDesktopNavigation
                        selectedMenu={selectedMenu}
                        onMenuSelect={setSelectedMenu}
                    />

                    <div className="flex-1 pb-20 md:pb-0">
                        {selectedMenu === "statistics" ? (
                            <TraderStatistics />
                        ) : selectedMenu === "tokens" ? (
                            <TokenManagement />
                        ) : (
                            <Settings />
                        )}
                    </div>

                    <TraderMobileNavigation
                        selectedMenu={selectedMenu}
                        onMenuSelect={setSelectedMenu}
                    />
                </div>
            ) : (
                <>
                    {traders.length > 0 && (
                        <SectionMessage
                            message="Copiers are not permitted to trade. To become a trader, you must stop copying all your current traders."
                            size="sm"
                            status="danger"
                        />
                    )}
                    <TraderBanner
                        onStartTrading={handleStartTrading}
                        disabled={traders.length > 0}
                    />
                </>
            )}
        </div>
    );
};

export default TraderDashboard;
