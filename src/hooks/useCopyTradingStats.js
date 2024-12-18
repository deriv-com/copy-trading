import { useState, useEffect } from 'react';
import useDerivWebSocket from './useDerivWebSocket';

const useCopyTradingStats = (traderId) => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { sendRequest, wsResponse } = useDerivWebSocket();

    useEffect(() => {
        if (!traderId) return;

        const fetchStats = () => {
            setIsLoading(true);
            sendRequest({
                copytrading_statistics: 1,
                trader_id: traderId,
            });
        };

        fetchStats();
    }, [traderId, sendRequest]);

    useEffect(() => {
        if (!wsResponse) return;

        if (wsResponse.error) {
            setError(wsResponse.error.message);
            setIsLoading(false);
            return;
        }

        if (wsResponse.msg_type === 'copytrading_statistics') {
            setStats(wsResponse.copytrading_statistics);
            setIsLoading(false);
        }
    }, [wsResponse]);

    return {
        stats,
        isLoading,
        error,
        refetch: () => {
            setError(null);
            sendRequest({
                copytrading_statistics: 1,
                trader_id: traderId,
            });
        },
    };
};

export default useCopyTradingStats; 