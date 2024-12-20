import { useState, useEffect } from 'react'
import useDerivWebSocket from '../hooks/useDerivWebSocket'
import TraderStatistics from './TraderStatistics'
import StartTrader from './StartTrader'
import TokenManagement from './TokenManagement'

const TraderDashboard = () => {
    const [isSettingsLoading, setIsSettingsLoading] = useState(false)
    const { sendRequest, wsResponse, settings } = useDerivWebSocket()

    useEffect(() => {
        if (wsResponse?.msg_type === 'set_settings') {
            setIsSettingsLoading(false)
            if (!wsResponse.error) {
                // Refresh settings after successful update
                sendRequest({
                    get_settings: 1
                })
            } else {
                console.error('Failed to update settings:', wsResponse.error)
            }
        }
    }, [wsResponse, sendRequest])

    const handleStartTrading = () => {
        setIsSettingsLoading(true)
        sendRequest({
            set_settings: 1,
            allow_copiers: 1
        })
    }

    if (!settings?.allow_copiers) {
        return <StartTrader onStartTrading={handleStartTrading} isLoading={isSettingsLoading} />
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <TokenManagement sendRequest={sendRequest} wsResponse={wsResponse} />
            <TraderStatistics />
        </div>
    )
}

export default TraderDashboard
