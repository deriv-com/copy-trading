import { Text } from "@deriv-com/quill-ui";
import { useAuth } from "../hooks/useAuth.jsx";
import useCopyTradingStats from "../hooks/useCopyTradingStats";
import StatCard from "./StatCard";
import StatisticsShimmer from "./StatisticsShimmer";
import ProfitableTrades from "./ProfitableTrades";

const TraderStatistics = () => {
    const { defaultAccount } = useAuth();
    const { stats, isLoading, error } = useCopyTradingStats(
        defaultAccount?.account
    );

    if (error) {
        return (
            <div className="text-red-500">
                Error loading statistics: {error}
            </div>
        );
    }

    if (isLoading || !stats) {
        return (
            <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                <StatisticsShimmer />
            </div>
        );
    }

    const statisticsData = [
        {
            label: "Average Duration",
            value: `${stats.avg_duration ?? 0} seconds`,
        },
        {
            label: "Average Loss",
            value: stats.avg_loss?.toFixed(2) ?? "0.00",
        },
        {
            label: "Average Profit",
            value: stats.avg_profit?.toFixed(2) ?? "0.00",
        },
        {
            label: "Current Copiers",
            value: stats.copiers ?? 0,
        },
        {
            label: "Performance Probability",
            value: `${(stats.performance_probability * 100).toFixed(1)}%`,
        },
        {
            label: "12 Months Profitable Trades",
            value: stats.last_12months_profitable_trades ?? 0,
        },
        {
            label: "Total Profitable Trades",
            value: stats.trades_profitable ?? 0,
        },
        {
            label: "Total Trades",
            value: stats.total_trades ?? 0,
        },
    ];

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex items-center mb-8 pb-6 border-b border-gray-200">
                <Text
                    size="xl"
                    bold
                    className="text-gray-800 font-extrabold tracking-tight"
                >
                    My Trading Statistics
                </Text>
            </div>
            <div className="space-y-8">
                {/* General Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {statisticsData.map((item, index) => (
                        <StatCard
                            key={index}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </div>

                {/* Profitable Trades */}
                {(Object.keys(stats.monthly_profitable_trades).length > 0 ||
                    Object.keys(stats.yearly_profitable_trades).length > 0) && (
                    <ProfitableTrades
                        monthlyTrades={stats.monthly_profitable_trades}
                        yearlyTrades={stats.yearly_profitable_trades}
                    />
                )}
            </div>
        </div>
    );
};

export default TraderStatistics;
