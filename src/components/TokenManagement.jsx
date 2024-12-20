import { useState, useEffect } from 'react'
import { TextField, Button, Text } from '@deriv-com/quill-ui'

const TokenManagement = ({ sendRequest, wsResponse }) => {
    const [tokens, setTokens] = useState([])
    const [tokenName, setTokenName] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [newToken, setNewToken] = useState(null)

    useEffect(() => {
        // Initial token fetch
        sendRequest({
            api_token: 1
        })
    }, [sendRequest])

    useEffect(() => {
        if (!wsResponse) return

        if (wsResponse.msg_type === 'api_token') {
            if (wsResponse.api_token?.token) {
                // Handle newly created token
                setNewToken({
                    token: wsResponse.api_token.token,
                    display_name: tokenName
                })
                // Request updated token list
                sendRequest({
                    api_token: 1
                })
            }
            else if (wsResponse.api_token?.tokens) {
                // Filter tokens with read scope
                const readTokens = wsResponse.api_token.tokens.filter(token =>
                    token.scopes?.includes('read')
                )
                setTokens(readTokens)
                setIsCreating(false)
                setTokenName('') // Clear form after successful creation
            }

            if (wsResponse.error) {
                console.error('API token error:', wsResponse.error.message)
                setIsCreating(false)
                setNewToken(null)
            }
        }
    }, [wsResponse, tokenName])

    const handleCreateToken = () => {
        if (!tokenName.trim()) return

        setIsCreating(true)
        setNewToken(null)
        sendRequest({
            api_token: 1,
            new_token: tokenName,
            new_token_scopes: ["read"],
            valid_for_current_ip_only: 0
        })
    }

    const handleCopyToken = (token) => {
        navigator.clipboard.writeText(token)
    }

    const canCopyToken = (token) => {
        return !token.includes('***')
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            {/* Token Creation Form */}
            <Text size="xl" bold className="mb-4">
                API Tokens
            </Text>

            <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <Text bold className="mb-2">Create New Token</Text>
                <div className="flex gap-2">
                    <TextField
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                        placeholder="Enter token name"
                        className="flex-1"
                        disabled={isCreating}
                    />
                    <Button
                        onClick={handleCreateToken}
                        variant="primary"
                        isLoading={isCreating}
                        disabled={isCreating || !tokenName.trim()}
                    >
                        {isCreating ? 'Creating...' : 'Create'}
                    </Button>
                </div>
                <Text className="mt-2 text-gray-600 text-sm">
                    This token will have read-only access for copy trading purposes.
                </Text>
            </div>

            {/* New Token Section */}
            {newToken && (
                <div className="mb-6">
                    <div className="mb-2 flex items-center gap-2">
                        <Text bold>New Token</Text>
                        <Text className="text-yellow-600 text-sm">
                            ⚠️ You won't see this token again. Copy it now!
                        </Text>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
                        <Text size="md" bold className="min-w-[150px] truncate">
                            {newToken.display_name}
                        </Text>
                        <TextField
                            value={newToken.token}
                            readOnly
                            onClick={(e) => e.target.select()}
                            className="flex-1 font-mono"
                        />
                        <Button
                            onClick={() => handleCopyToken(newToken.token)}
                            variant="primary"
                            size="sm"
                        >
                            Copy Token
                        </Button>
                    </div>
                </div>
            )}

            {/* Available Tokens List */}
            <div className="space-y-4">
                <Text bold>Available Tokens</Text>
                {tokens.length === 0 ? (
                    <Text className="text-gray-600">No tokens available. Create one to share with copiers.</Text>
                ) : (
                    tokens.map((token, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
                            <Text size="md" bold className="min-w-[150px] truncate">
                                {token.display_name}
                            </Text>
                            <TextField
                                value={token.token}
                                readOnly
                                onClick={(e) => e.target.select()}
                                className="flex-1 font-mono"
                            />
                            {canCopyToken(token.token) && (
                                <Button
                                    onClick={() => handleCopyToken(token.token)}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Copy
                                </Button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default TokenManagement
