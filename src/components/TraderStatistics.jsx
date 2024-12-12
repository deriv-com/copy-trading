import { useEffect, useState, useCallback } from 'react'
import { Text } from '@deriv-com/quill-ui'
import useDerivWebSocket from '../hooks/useDerivWebSocket'
import useDerivAccounts from '../hooks/useDerivAccounts'

const TraderStatistics = () => {
    const [statistics, setStatistics] = useState(null)
    const { socket, isConnected } = useDerivWebSocket()
    const { defaultAccount } = useDerivAccounts()

    const getStatistics = useCallback(() => {
        if (isConnected && defaultAccount?.account) {
            const request = {
                copytrading_statistics: 1,
                trader_id: defaultAccount.account
            }
            console.log('Sending statistics request:', request)
            socket.send(JSON.stringify(request))
        } else {
            console.log('Cannot send request:', {
                socketConnected: isConnected,
                hasAccount: Boolean(defaultAccount?.account),
                account: defaultAccount?.account
            })
        }
    }, [socket, isConnected, defaultAccount])

    useEffect(() => {
        if (isConnected) {
            console.log('Setting up WebSocket listener for statistics')
            const handleMessage = (msg) => {
                const response = JSON.parse(msg.data)
                console.log('WebSocket message in TraderStatistics:', response)

                if (response.msg_type === 'copytrading_statistics') {
                    if (response.error) {
                        console.error('Statistics error:', response.error)
                    } else {
                        console.log('Received statistics:', response.copytrading_statistics)
                        setStatistics(response.copytrading_statistics)
                    }
                }
            }

            socket.addEventListener('message', handleMessage)
            console.log('Requesting initial statistics')
            getStatistics()

            return () => {
                console.log('Cleaning up WebSocket listener')
                socket.removeEventListener('message', handleMessage)
            }
        }
    }, [isConnected, getStatistics])

    if (!statistics) {
        return <div>Loading statistics...</div>
    }

    const statisticsData = [
        {
            label: 'Active Copiers',
            value: statistics.active_copiers ?? '-'
        },
        {
            label: 'Total Profit',
            value: statistics.total_profit != null
                ? `${statistics.total_profit.toFixed(2)} ${defaultAccount?.currency || 'USD'}`
                : '-'
        },
        {
            label: 'Performance Fee',
            value: statistics.performance_fee != null
                ? `${statistics.performance_fee}%`
                : '-'
        },
        {
            label: 'Total Trades',
            value: statistics.total_trades ?? '-'
        },
        {
            label: 'Successful Trades',
            value: statistics.successful_trades != null && statistics.total_trades != null
                ? `${statistics.successful_trades} (${((statistics.successful_trades / statistics.total_trades) * 100).toFixed(1)}%)`
                : '-'
        }
    ]

    return (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
            <Text size="2xl" bold className="mb-6">
                Trading Statistics
            </Text>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Metric
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {statisticsData.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.label}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {item.value}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TraderStatistics 
