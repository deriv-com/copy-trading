import { useState, useEffect } from 'react'
import useDerivWebSocket from '../hooks/useDerivWebSocket'
import TraderStatistics from './TraderStatistics'
import { TextField, Button, Text } from '@deriv-com/quill-ui'

const TraderDashboard = () => {
    const [apiToken, setApiToken] = useState('')
    const { sendRequest, wsResponse, isConnected } = useDerivWebSocket()

    useEffect(() => {
        if (!wsResponse) return

        // When connected, request existing tokens
        if (wsResponse.msg_type === 'authorize' && isConnected && !apiToken) {
            console.log('Checking for existing API tokens...')
            sendRequest({
                api_token: 1
            })
        }

        // Handle API token responses
        if (wsResponse.msg_type === 'api_token') {
            console.log('API token response:', wsResponse)

            // If we got a list of tokens, check for existing copy trading token
            if (wsResponse.api_token?.tokens) {
                console.log('Existing tokens:', wsResponse.api_token.tokens)

                const copyTradingToken = wsResponse.api_token.tokens.find(token => {
                    console.log('Checking token:', {
                        display_name: token.display_name,
                        scopes: token.scopes,
                        token: token.token
                    })
                    // Only check for read scope and CopyTrading display name
                    return token.scopes?.includes('read') && token.display_name === 'CopyTrading'
                })

                if (copyTradingToken) {
                    console.log('Found existing copy trading token:', copyTradingToken)
                    setApiToken(copyTradingToken.token)
                } else {
                    console.log('No copy trading token found, creating new one...')
                    sendRequest({
                        api_token: 1,
                        new_token: "CopyTrading",
                        new_token_scopes: ["read"],
                        valid_for_current_ip_only: 0
                    })
                }
            }
            // If we got a new token, save it
            else if (wsResponse.api_token?.token) {
                console.log('New token received:', wsResponse.api_token.token)
                setApiToken(wsResponse.api_token.token)
            }

            if (wsResponse.error) {
                console.error('API token error:', wsResponse.error.message)
            }
        }
    }, [wsResponse, isConnected, sendRequest, apiToken])

    const handleCopyToken = () => {
        navigator.clipboard.writeText(apiToken)
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <Text size="2xl" bold className="mb-4">
                    Your Copy Trading API Token
                </Text>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex gap-2">
                        <TextField
                            value={apiToken || "Loading API token..."}
                            readOnly
                            onClick={(e) => e.target.select()}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleCopyToken}
                            disabled={!apiToken}
                            variant="primary"
                        >
                            Copy
                        </Button>
                    </div>
                    <Text className="mt-4 text-gray-600">
                        Share this token with users who want to copy your trades.
                        This is a read-only token that allows others to monitor and copy your trading activity.
                    </Text>
                </div>
            </div>

            <TraderStatistics />
        </div>
    )
}

export default TraderDashboard 
