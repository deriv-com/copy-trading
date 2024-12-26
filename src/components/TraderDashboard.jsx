import useSettings from "../hooks/useSettings";
import TraderStatistics from "./TraderStatistics";
import StartTrader from "./StartTrader";
import TokenManagement from "./TokenManagement";
import { Spinner } from "@deriv-com/quill-ui";
import { useState } from "react";

const TraderDashboard = () => {
    const { settings, isLoading, updateSettings } = useSettings();
    const [selectedMenu, setSelectedMenu] = useState("statistics");

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
            <div className="flex flex-col md:flex-row gap-6">
                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    <div className="w-48 p-1 bg-system-light-secondary-background rounded-2xl">
                        <div className="relative flex flex-col">
                            {/* Animated Background */}
                            <div
                                className="absolute transition-transform duration-200 ease-in-out bg-white rounded-xl shadow-sm h-12"
                                style={{
                                    transform: `translateY(${selectedMenu === "statistics" ? "0" : "48px"})`,
                                    width: "calc(100% - 8px)",
                                    left: "4px",
                                }}
                            />

                            {/* Buttons */}
                            <button
                                onClick={() => setSelectedMenu("statistics")}
                                className={`relative h-12 px-4 rounded-xl flex items-center justify-start transition-colors ${selectedMenu === "statistics"
                                    ? "text-solid-slate-1400 font-bold"
                                    : "text-solid-slate-700 hover:text-solid-slate-1200"
                                    }`}
                            >
                                Statistics
                            </button>
                            <button
                                onClick={() => setSelectedMenu("tokens")}
                                className={`relative h-12 px-4 rounded-xl flex items-center justify-start transition-colors ${selectedMenu === "tokens"
                                    ? "text-solid-slate-1400 font-bold"
                                    : "text-solid-slate-700 hover:text-solid-slate-1200"
                                    }`}
                            >
                                API Tokens
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 pb-20 md:pb-0">
                    {selectedMenu === "statistics" ? (
                        <TraderStatistics />
                    ) : (
                        <TokenManagement />
                    )}
                </div>

                {/* Mobile Bottom Navigation */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-system-light-secondary-background px-4 py-3">
                    <div className="flex justify-around items-center max-w-6xl mx-auto">
                        <button
                            onClick={() => setSelectedMenu("statistics")}
                            className={`flex flex-col items-center px-4 py-2 rounded-lg w-32 ${selectedMenu === "statistics"
                                ? "text-solid-slate-1400 font-bold"
                                : "text-solid-slate-700"
                                }`}
                        >
                            <span className="text-sm">Statistics</span>
                        </button>
                        <button
                            onClick={() => setSelectedMenu("tokens")}
                            className={`flex flex-col items-center px-4 py-2 rounded-lg w-32 ${selectedMenu === "tokens"
                                ? "text-solid-slate-1400 font-bold"
                                : "text-solid-slate-700"
                                }`}
                        >
                            <span className="text-sm">API Tokens</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TraderDashboard;
