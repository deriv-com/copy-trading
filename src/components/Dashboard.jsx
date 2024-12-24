import { useState } from "react";
import { Button } from "@deriv-com/quill-ui";
import TraderDashboard from "./TraderDashboard";
import CopierDashboard from "./CopierDashboard";

const Dashboard = () => {
    const [userType, setUserType] = useState("copier");

    const handleBecomeTrader = () => {
        setUserType("trader");
    };

    const handleBecomeCopier = () => {
        setUserType("copier");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                {/* Top Buttons Section */}
                <div className="flex justify-center gap-4 mb-8">
                    <Button
                        variant={
                            userType === "copier" ? "primary" : "secondary"
                        }
                        onClick={handleBecomeCopier}
                    >
                        Copier
                    </Button>
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
                </div>

                {/* Dashboard Content */}
                {userType === "trader" ? (
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
