import { useState, useEffect } from "react";
import useSettings from "../hooks/useSettings";

const Settings = () => {
    const { settings, updateSettings, isLoading } = useSettings();
    const [allowCopiers, setAllowCopiers] = useState(false);

    useEffect(() => {
        if (settings?.allow_copiers !== undefined) {
            setAllowCopiers(settings.allow_copiers);
        }
    }, [settings]);

    const handleTraderToggle = async () => {
        try {
            await updateSettings({ allow_copiers: !allowCopiers ? 1 : 0 });
            setAllowCopiers(!allowCopiers);
        } catch (error) {
            console.error("Failed to update trader status:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="p-4">
                <div className="animate-pulse h-8 w-32 bg-gray-200 rounded mb-4"></div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-solid-slate-1400">Trader Mode</h3>
                        <p className="text-solid-slate-700 text-sm mt-1">
                            Enable this to allow others to copy your trades
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={allowCopiers}
                            onChange={handleTraderToggle}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Settings;
