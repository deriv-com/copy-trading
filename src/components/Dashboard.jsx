import { useState, useEffect } from "react";
import { SegmentedControlSingleChoice, Skeleton } from "@deriv-com/quill-ui";
import { useAuth } from "../hooks/useAuth.jsx";
import useSettings from "../hooks/useSettings.js";
import TraderDashboard from "./TraderDashboard";
import CopierDashboard from "./CopierDashboard";

const Dashboard = () => {
    const { isLoading: authLoading } = useAuth();
    const { settings, isLoading: settingsLoading } = useSettings();
    const [userType, setUserType] = useState(() => {
        // Set initial state based on settings if available
        return settings?.allow_copier ? "trader" : "copier";
    });

    useEffect(() => {
        console.log("Settings updated:", settings);
        if (settings) {
            const newUserType = settings.allow_copier ? "trader" : "copier";
            console.log("Setting userType to:", newUserType);
            setUserType(newUserType);
        }
    }, [settings]);

    const isLoading = authLoading || settingsLoading;

    return (
        <div className="min-h-screen">
            <div className="md:max-w-6xl mx-auto md:p-6">
                {/* User Type Selection */}
                <div className="flex justify-center mt-4 md:mt-6 mb-8">
                    <SegmentedControlSingleChoice
                        onChange={(index) => {
                            setUserType(index === 0 ? "copier" : "trader");
                        }}
                        options={[
                            {
                                label: "Copy",
                            },
                            {
                                label: "Trade",
                            },
                        ]}
                        selectedItemIndex={userType === "copier" ? 0 : 1}
                        size="md"
                    />
                </div>

                {/* Dashboard Content */}
                {isLoading ? (
                    <div className="space-y-4">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <Skeleton.Square
                                active
                                rounded
                                width="100%"
                                height="100px"
                            />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <Skeleton.Square
                                active
                                rounded
                                width="100%"
                                height="200px"
                            />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <Skeleton.Square
                                active
                                rounded
                                width="100%"
                                height="150px"
                            />
                        </div>
                    </div>
                ) : userType === "trader" ? (
                    <TraderDashboard />
                ) : userType === "copier" ? (
                    <CopierDashboard />
                ) : (
                    <CopierDashboard />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
