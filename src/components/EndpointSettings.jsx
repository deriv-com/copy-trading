import { useState } from "react";
import { TextField, Button, Text } from "@deriv-com/quill-ui";
import { getConfig } from "../config";

const EndpointSettings = () => {
    const config = getConfig();
    const [server, setServer] = useState("blue.derivws.com");
    const [appId, setAppId] = useState(config.APP_ID);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle submission logic here
    };

    const handleReset = () => {
        setServer("blue.derivws.com");
        setAppId(config.APP_ID);
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
                                helperText="e.g. frontend.derivws.com"
                                fullWidth
                            />
                        </div>

                        <div>
                            <TextField
                                label="OAuth App ID"
                                value={appId}
                                onChange={(e) => setAppId(e.target.value)}
                                helperText="Register an app ID to use the above server for logging in."
                                fullWidth
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
