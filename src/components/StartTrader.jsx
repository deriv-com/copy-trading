import { useState, useEffect } from 'react'
import useDerivWebSocket from '../hooks/useDerivWebSocket'
import Header from './Header'
import { useNavigate } from 'react-router-dom'

const StartTrader = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [apiToken, setApiToken] = useState('')
    const [error, setError] = useState('')
    const { sendRequest, wsResponse } = useDerivWebSocket()
    const navigate = useNavigate()

    useEffect(() => {
        // Automatically start the trader setup process when component mounts
        handleStartTrader()
    }, [])

    const handleStartTrader = async () => {
        setIsLoading(true)
        setError('')

        // Step 1: Enable copy trading by setting allow_copiers to 1
        sendRequest({
            set_settings: 1,
            allow_copiers: 1
        })
    }

    const handleDone = () => {
        navigate('/dashboard')
    }

    // Handle WebSocket responses
    useEffect(() => {
        if (!wsResponse) return

        if (wsResponse.msg_type === 'set_settings') {
            if (wsResponse.error) {
                setError('Failed to enable copy trading: ' + wsResponse.error.message)
                setIsLoading(false)
                return
            }

            // Step 2: Create read-only API token for copiers
            sendRequest({
                api_token: 1,
                new_token: "CopyTrading",
                new_token_scopes: ["read"],
                valid_for_current_ip_only: 0
            })
        }

        if (wsResponse.msg_type === 'api_token') {
            if (wsResponse.error) {
                setError('Failed to generate API token: ' + wsResponse.error.message)
                setIsLoading(false)
                return
            }

            // Store the generated token
            setApiToken(wsResponse.api_token.token)
            setIsLoading(false)
        }
    }, [wsResponse, sendRequest])

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="start-trader-container">
                <h2 className="text-2xl font-bold mb-6">Trader Setup</h2>

                {isLoading && (
                    <div className="loading-spinner">
                        <div className="text-xl mb-4">Setting up your trader account...</div>
                        <div>This will only take a moment</div>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                        <button
                            onClick={handleStartTrader}
                            className="mt-4 start-trader-button"
                        >
                            Retry Setup
                        </button>
                    </div>
                )}

                {apiToken && (
                    <div className="token-container">
                        <h3 className="text-xl font-semibold mb-4">Your Copy Trading API Token</h3>
                        <div className="token-field">
                            <input
                                type="text"
                                value={apiToken}
                                readOnly
                                onClick={(e) => e.target.select()}
                            />
                            <button
                                onClick={() => navigator.clipboard.writeText(apiToken)}
                                className="copy-button"
                            >
                                Copy
                            </button>
                        </div>
                        <p className="token-info">
                            Share this token with users who want to copy your trades.
                            This is a read-only token that allows others to monitor and copy your trading activity.
                        </p>
                        <button
                            onClick={handleDone}
                            className="mt-6 start-trader-button"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StartTrader 
