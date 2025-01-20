import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import { TextField, Button, Text } from "@deriv-com/quill-ui";
import {
    getStoredEndpointSettings,
    setEndpointSettings,
    getDefaultServer,
    getDefaultAppId,
} from "../config";

const EndpointSettings = () => {
    const navigate = useNavigate();
    const defaultServer = getDefaultServer();
    const defaultAppId = getDefaultAppId();

    const [server, setServer] = useState(defaultServer);
    const [appId, setAppId] = useState(defaultAppId);

    useEffect(() => {
        const storedSettings = getStoredEndpointSettings();
        if (storedSettings) {
            setServer(storedSettings.server);
            setAppId(storedSettings.appId);
        } else {
            setEndpointSettings(defaultServer, defaultAppId);
        }
    }, [defaultServer, defaultAppId]);

    const { logout } = useLogout();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // First ensure the settings are valid
            if (!server || !appId) {
                console.error("Invalid settings:", { server, appId });
                return;
            }

            console.log("Saving new endpoint settings:", { server, appId });
            setEndpointSettings(server, appId);

            // Verify settings were saved
            const storedSettings = getStoredEndpointSettings();
            console.log("Verifying saved settings:", storedSettings);

            if (
                !storedSettings ||
                storedSettings.server !== server ||
                storedSettings.appId !== appId
            ) {
                console.error("Settings verification failed:", {
                    expected: { server, appId },
                    stored: storedSettings,
                });
                return;
            }

            // Only logout and redirect if settings were saved successfully
            console.log("Settings saved successfully, logging out...");
            await logout();
            console.log("Logged out, redirecting to home...");
            navigate("/");
        } catch (error) {
            console.error("Failed to update endpoint settings:", error);
        }
    };

    const handleReset = () => {
        setEndpointSettings(defaultServer, defaultAppId);
        setServer(defaultServer);
        setAppId(defaultAppId);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Text as="h2" size="xl" bold>
                            Change API endpoint
                        </Text>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <TextField
                                label="Server"
                                value={server}
                                onChange={(e) => setServer(e.target.value)}
                                message="e.g. frontend.derivws.com"
                            />
                        </div>

                        <div>
                            <TextField
                                label="OAuth App ID"
                                value={appId}
                                onChange={(e) => setAppId(e.target.value)}
                                message="Register an app ID to use the above server for logging in."
                            />
                        </div>

                        <div className="flex space-x-4">
                            <Button
                                type="submit"
                                variant="secondary"
                                color="black"
                            >
                                Submit
                            </Button>
                            <Button
                                color="black"
                                variant="secondary"
                                onClick={handleReset}
                            >
                                Reset to original settings
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EndpointSettings;
