import useSettings from "../hooks/useSettings";
import TraderStatistics from "./TraderStatistics";
import StartTrader from "./StartTrader";
import TokenManagement from "./TokenManagement";
import { Spinner } from "@deriv-com/quill-ui";

const TraderDashboard = () => {
    const { settings, isLoading, updateSettings } = useSettings();

    const handleStartTrading = async () => {
        try {
            await updateSettings({ allow_copiers: 1 });
        } catch (error) {
            console.error("Failed to update settings:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <Spinner />
            </div>
        );
    }

    if (!settings?.allow_copiers) {
        return <StartTrader onStartTrading={handleStartTrading} />;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <TokenManagement />
            <TraderStatistics />
        </div>
    );
};

export default TraderDashboard;
