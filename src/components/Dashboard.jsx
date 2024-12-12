import { useEffect, useState } from 'react'
import { Button, Text } from '@deriv-com/quill-ui'
import useDerivWebSocket from '../hooks/useDerivWebSocket'
import Header from './Header'
import TraderStatistics from './TraderStatistics'

const Dashboard = () => {
    const { settings, isLoading, getSettings, isConnected, sendRequest } = useDerivWebSocket()
    const [userType, setUserType] = useState(null)

    useEffect(() => {
        if (settings) {
            setUserType(settings.allow_copiers ? 'trader' : null)
        }
    }, [settings])

    const handleBecomeTrader = () => {
        sendRequest({
            set_settings: 1,
            allow_copiers: 1
        })
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (userType === 'trader') {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex flex-col items-center justify-center p-6 mt-10">
                    <Text
                        size="5xl"
                        bold
                        className="mb-4 text-center animate-fade-in"
                    >
                        Welcome Trader! 🎉
                    </Text>
                    <Text
                        size="xl"
                        className="text-gray-600 text-center max-w-2xl mb-8"
                    >
                        You are now set up as a trader. Other users can copy your trades and benefit from your expertise.
                    </Text>
                    <TraderStatistics />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="p-6">
                <Text size="2xl" bold className="mb-6">
                    Choose Your Role
                </Text>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border rounded-lg shadow-sm">
                        <Text size="xl" bold className="mb-4">
                            Become a Trader
                        </Text>
                        <Text className="mb-4">
                            Allow others to copy your trades and earn from your trading expertise.
                        </Text>
                        <Button
                            variant="primary"
                            onClick={handleBecomeTrader}
                        >
                            Become a Trader
                        </Button>
                    </div>

                    <div className="p-6 border rounded-lg shadow-sm">
                        <Text size="xl" bold className="mb-4">
                            Become a Copier
                        </Text>
                        <Text className="mb-4">
                            Copy trades from successful traders and benefit from their experience.
                        </Text>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                console.log('Becoming a copier...')
                            }}
                        >
                            Become a Copier
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard 
