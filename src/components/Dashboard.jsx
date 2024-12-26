import { useState } from "react";
import { SegmentedControlSingleChoice, Skeleton } from "@deriv-com/quill-ui";
import { useAuth } from "../hooks/useAuth.jsx";
import TraderDashboard from "./TraderDashboard";
import CopierDashboard from "./CopierDashboard";

const Dashboard = () => {
    const [userType, setUserType] = useState("copier");
    const { isLoading } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                {/* User Type Selection */}
                <div className="flex justify-center mb-8">
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
                            <Skeleton.Square active rounded width="100%" height="100px" />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <Skeleton.Square active rounded width="100%" height="200px" />
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <Skeleton.Square active rounded width="100%" height="150px" />
                        </div>
                    </div>
                ) : (
                    userType === "trader" ? (
                        <TraderDashboard />
                    ) : userType === "copier" ? (
                        <CopierDashboard />
                    ) : (
                        <CopierDashboard />
                    )
                )}
            </div>
        </div>
    );
};

export default Dashboard;
