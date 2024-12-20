import { useState } from "react";
import {
    Button,
    Text,
    SegmentedControlSingleChoice,
} from "@deriv-com/quill-ui";
import useDerivWebSocket from "../hooks/useDerivWebSocket";
import Header from "./Header";
import TraderDashboard from "./TraderDashboard";
import CopierDashboard from "./CopierDashboard";

const Dashboard = () => {
    const { settings, isLoading, sendRequest } = useDerivWebSocket();
    const [userType, setUserType] = useState("trader");

    const items = [
        { label: "Trader", value: "trader" },
        { label: "Copier", value: "copier" },
    ];

    const handleBecomeTrader = () => {
        sendRequest({
            set_settings: 1,
            allow_copiers: 1,
        });
        setUserType("trader");
    };

    const handleBecomeCopier = () => {
        sendRequest({
            set_settings: 1,
            allow_copiers: 0,
        });
        setUserType("copier");
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto p-6">
                {/* Top Buttons Section */}
                <div className="flex justify-center gap-4 mb-8">
                    <Button
                        variant={
                            userType === "trader" || userType === null
                                ? "primary"
                                : "secondary"
                        }
                        onClick={handleBecomeTrader}
                    >
                        Trader
                    </Button>
                    <Button
                        variant={
                            userType === "copier" ? "primary" : "secondary"
                        }
                        onClick={handleBecomeCopier}
                    >
                        Copier
                    </Button>
                </div>

                {/* Dashboard Content */}
                {userType === "trader" ? (
                    <TraderDashboard />
                ) : userType === "copier" ? (
                    <CopierDashboard />
                ) : (
                    <TraderDashboard />
                )}
            </div>
        </div>
    );
};

export default Dashboard;
