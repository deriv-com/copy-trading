import { useState, useEffect } from 'react';
import useWebSocket from './useWebSocket';

const useCopyTradingStats = (traderId) => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { sendMessage, lastMessage } = useWebSocket();

    const fetchStats = () => {
        if (!traderId) return;

        setIsLoading(true);
        setError(null);
        sendMessage({
            copytrading_statistics: 1,
            trader_id: traderId,
            passthrough: {
                trader_id: traderId
            }
        });
    };

    useEffect(() => {
        if (!lastMessage || !traderId) return;

        // Check if this response is for the current trader
        if (lastMessage.passthrough?.trader_id === traderId) {
            if (lastMessage.error) {
                setError(lastMessage.error.message);
                setIsLoading(false);
                return;
            }

            if (lastMessage.msg_type === 'copytrading_statistics') {
                setStats(lastMessage.copytrading_statistics);
                setIsLoading(false);
            }
        }
    }, [lastMessage, traderId]);

    return {
        stats,
        isLoading,
        error,
        fetchStats,
    };
};

export default useCopyTradingStats;
