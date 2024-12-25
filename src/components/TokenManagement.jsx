import { useState, useEffect } from "react";
import { TextField, Button, Text } from "@deriv-com/quill-ui";
import useAPIToken from "../hooks/useAPIToken";

const TokenManagement = () => {
    const { createToken, getTokens } = useAPIToken();
    const [tokens, setTokens] = useState([]);
    const [tokenName, setTokenName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [newToken, setNewToken] = useState(null);

    const fetchTokens = async () => {
        try {
            const response = await getTokens();
            if (response.api_token?.tokens) {
                // Filter tokens with read scope
                const readTokens = response.api_token.tokens.filter((token) =>
                    token.scopes?.includes("read")
                );
                setTokens(readTokens);
            }
        } catch (error) {
            console.error("Failed to fetch tokens:", error);
        }
    };

    useEffect(() => {
        fetchTokens();
    }, []);

    const handleCreateToken = async () => {
        if (!tokenName.trim()) return;

        setIsCreating(true);
        setNewToken(null);

        try {
            const response = await createToken(tokenName, ["read"]);
            if (response.api_token?.token) {
                setNewToken({
                    token: response.api_token.token,
                    display_name: tokenName,
                });
                setTokenName(""); // Clear form after successful creation
                fetchTokens(); // Refresh token list
            }
        } catch (error) {
            console.error("Failed to create token:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleCopyToken = (token) => {
        navigator.clipboard.writeText(token);
    };

    const canCopyToken = (token) => {
        return !token.includes("***");
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            {/* Token Creation Form */}
            <Text size="xl" bold className="mb-4">
                API Tokens
            </Text>

            <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <Text bold className="mb-2">
                    Create New Token
                </Text>
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
                        {isCreating ? "Creating..." : "Create"}
                    </Button>
                </div>
                <Text className="mt-2 text-gray-600 text-sm">
                    This token will have read-only access for copy trading
                    purposes.
                </Text>
            </div>

            {/* New Token Section */}
            {newToken && (
                <div className="mb-6">
                    <div className="mb-2 flex items-center gap-2">
                        <Text bold>New Token</Text>
                        <Text className="text-yellow-600 text-sm">
                            ⚠️ You won&apos;t see this token again. Copy it now!
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
                    <Text className="text-gray-600">
                        No tokens available. Create one to share with copiers.
                    </Text>
                ) : (
                    tokens.map((token, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 bg-gray-50 rounded-md"
                        >
                            <Text
                                size="md"
                                bold
                                className="min-w-[150px] truncate"
                            >
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
    );
};

export default TokenManagement;
