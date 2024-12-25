import { useState, useEffect } from "react";
import { TextField, Button, Text } from "@deriv-com/quill-ui";
import { LegacyDelete1pxIcon } from "@deriv/quill-icons";
import useAPIToken from "../hooks/useAPIToken";

const TOKEN_NAME_REGEX = /^[a-zA-Z0-9_]+$/;

const TokenManagement = () => {
    const { createToken, getTokens, deleteToken } = useAPIToken();
    const [tokens, setTokens] = useState([]);
    const [tokenName, setTokenName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [newToken, setNewToken] = useState(null);
    const [error, setError] = useState("");
    const [isValidInput, setIsValidInput] = useState(true);

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
        setError("");

        try {
            const response = await createToken(tokenName, ["read"]);
            if (response.api_token?.token) {
                const tokenResponse = response.api_token.token;
                await fetchTokens(); // Refresh token list immediately after success
                setNewToken({
                    token: tokenResponse,
                    display_name: tokenName,
                });
                setTokenName(""); // Clear form after successful creation
            }
        } catch (error) {
            console.error("Failed to create token:", error);
            setError(
                error.message || "Failed to create token. Please try again."
            );
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteToken = async (token) => {
        setError("");
        try {
            await deleteToken(token);
            fetchTokens(); // Refresh token list after deletion
        } catch (error) {
            console.error("Failed to delete token:", error);
            setError(
                error.message || "Failed to delete token. Please try again."
            );
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col gap-4">
            {/* Token Creation Form */}
            <Text size="xl" bold className="mb-4">
                API Tokens
            </Text>

            <div className="mb-6 rounded-md flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-start gap-2">
                    <TextField
                        label="Create New Token"
                        value={tokenName}
                        onChange={(e) => {
                            const value = e.target.value;
                            setTokenName(value);
                            setIsValidInput(
                                value === "" || TOKEN_NAME_REGEX.test(value)
                            );
                            if (value === "" || TOKEN_NAME_REGEX.test(value)) {
                                setError("");
                            }
                        }}
                        placeholder="Enter token name"
                        disabled={isCreating}
                        fullWidth
                        status={!isValidInput || !!error ? "error" : undefined}
                        message={
                            !isValidInput
                                ? "Only letters, numbers, and underscores are allowed"
                                : error || ""
                        }
                    />
                    <Button
                        onClick={handleCreateToken}
                        variant="primary"
                        size="lg"
                        isLoading={isCreating}
                        disabled={
                            isCreating || !tokenName.trim() || !isValidInput
                        }
                        className="w-full md:w-auto"
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
                        <Text className="flex-1 font-mono break-all">
                            {newToken.token}
                        </Text>
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
                            className="flex items-center gap-4 p-4 bg-gray-100/50 rounded-md"
                        >
                            <Text
                                size="md"
                                bold
                                className="min-w-[150px] truncate"
                            >
                                {token.display_name}
                            </Text>
                            <Text className="flex-1 font-mono break-all">
                                {token.token}
                            </Text>
                            <button
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                onClick={() => handleDeleteToken(token.token)}
                            >
                                <LegacyDelete1pxIcon
                                    fill="#FF7F50"
                                    iconSize="xs"
                                />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TokenManagement;
