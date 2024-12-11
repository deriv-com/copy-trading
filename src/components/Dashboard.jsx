import { useEffect } from 'react'
import useDerivAccounts from '../hooks/useDerivAccounts'
import useDerivWebSocket from '../hooks/useDerivWebSocket'
import { Text } from '@deriv-com/quill-ui'
import Header from './Header'

const Dashboard = () => {
    const { defaultAccount, otherAccounts, clearAccounts, updateAccounts } = useDerivAccounts()
    const { isConnected, sendRequest } = useDerivWebSocket()

    const accountOptions = [defaultAccount, ...otherAccounts]
        .filter(Boolean)
        .map(account => ({
            value: account.account,
            label: `${account.account} (${account.currency})`,
            data: account
        }))

    const handleAccountChange = (selectedAccount) => {
        const newDefault = accountOptions.find(opt => opt.value === selectedAccount)?.data
        if (!newDefault) return

        const newOthers = [defaultAccount, ...otherAccounts]
            .filter(acc => acc && acc.account !== newDefault.account)

        updateAccounts(newDefault, newOthers)
    }

    const handleLogout = () => {
        clearAccounts()
        window.location.href = '/'
    }

    useEffect(() => {
        if (isConnected) {
            sendRequest({
                balance: 1,
                subscribe: 1
            })
        }
    }, [isConnected, sendRequest])

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                defaultAccount={defaultAccount}
                accountOptions={accountOptions}
                onAccountChange={handleAccountChange}
                onLogout={handleLogout}
            />

            <main className="max-w-4xl mx-auto p-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <Text
                        size="lg"
                        color="general"
                        className="mb-2"
                    >
                        Account: <Text color="prominent">{defaultAccount?.account}</Text>
                    </Text>
                    <Text
                        size="lg"
                        color="general"
                        className="mb-2"
                    >
                        Currency: <Text color="prominent">{defaultAccount?.currency}</Text>
                    </Text>
                    <Text
                        size="lg"
                        color="general"
                        className="mb-6"
                    >
                        Connection Status:{' '}
                        <Text color={isConnected ? 'success' : 'error'}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </Text>
                    </Text>
                </div>
            </main>
        </div>
    )
}

export default Dashboard 
