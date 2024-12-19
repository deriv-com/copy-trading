import { useState } from "react";
import { Button, Text } from "@deriv-com/quill-ui";
import useDerivWebSocket from "../hooks/useDerivWebSocket";
import Header from "./Header";
import TraderDashboard from "./TraderDashboard";
import CopierDashboard from "./CopierDashboard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { settings, isLoading, sendRequest } = useDerivWebSocket();
    const navigate = useNavigate();
    const [userType, setUserType] = useState(() => {
        return localStorage.getItem("userType");
    });

    const handleBecomeTrader = () => {
        sendRequest({
            set_settings: 1,
            allow_copiers: 1,
        });
        setUserType("trader");
        localStorage.setItem("userType", "trader");
    };

    const handleBecomeCopier = () => {
        sendRequest({
            set_settings: 1,
            allow_copiers: 0,
        });
        setUserType("copier");
        localStorage.setItem("userType", "copier");
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Render trader dashboard
    if (userType === "trader") {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <TraderDashboard />
            </div>
        );
    }

    // Render copier dashboard
    if (userType === "copier") {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <CopierDashboard />
            </div>
        );
    }

    // Render role selection for users who haven't chosen yet
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-6xl mx-auto p-6">
                <Text size="3xl" bold className="mb-8 text-center">
                    Choose Your Trading Role
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                        <Text size="2xl" bold className="mb-4">
                            Become a Trader 📈
                        </Text>
                        <Text className="mb-6 text-gray-600 h-24">
                            Share your trading expertise with others. Allow
                            copiers to follow your trades and earn additional
                            income through performance fees.
                        </Text>
                        <ul className="mb-6 space-y-2 text-gray-600">
                            <li>• Set your own performance fees</li>
                            <li>• Build your trading reputation</li>
                            <li>• Track your copier statistics</li>
                        </ul>
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={handleBecomeTrader}
                        >
                            Start as Trader
                        </Button>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                        <Text size="2xl" bold className="mb-4">
                            Become a Copier 🔄
                        </Text>
                        <Text className="mb-6 text-gray-600 h-24">
                            Copy trades from successful traders automatically.
                            Choose from a variety of traders and let their
                            expertise work for you.
                        </Text>
                        <ul className="mb-6 space-y-2 text-gray-600">
                            <li>• Browse top traders</li>
                            <li>• Copy trades automatically</li>
                            <li>• Monitor performance in real-time</li>
                        </ul>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={handleBecomeCopier}
                        >
                            Start as Copier
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
