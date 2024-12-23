import { useState, useEffect } from "react";
import { Text, Button, TextField, Snackbar } from "@deriv-com/quill-ui";
import PropTypes from "prop-types";
import useDerivWebSocket from "../hooks/useDerivWebSocket";

const AddTraderForm = ({ onAddTrader }) => {
    const [traderData, setTraderData] = useState({
        token: "",
    });

    const { sendRequest, wsResponse } = useDerivWebSocket();
    const [isProcessing, setIsProcessing] = useState(false);
    const [snackbar, setSnackbar] = useState({
        isVisible: false,
        message: "",
        status: "neutral",
    });

    useEffect(() => {
        if (!wsResponse || !isProcessing) return;

        if (wsResponse.msg_type === "copy_start") {
            setIsProcessing(false);

            if (wsResponse.error) {
                setSnackbar({
                    isVisible: true,
                    message:
                        wsResponse.error.message ||
                        "Failed to start copy trading",
                    status: "fail",
                });
            } else {
                onAddTrader?.(traderData);
                setTraderData({ token: "" });
                setSnackbar({
                    isVisible: true,
                    message: "Successfully started copy trading",
                    status: "neutral",
                });
            }
        }
    }, [wsResponse, isProcessing, onAddTrader, traderData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        sendRequest({
            copy_start: traderData.token,
        });
    };

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, isVisible: false }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTraderData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <>
            <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
                <Text size="xl" bold className="mb-4">
                    Add New Trader
                </Text>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="w-full flex-1">
                            <TextField
                                className="w-full"
                                label="Trading Token"
                                name="token"
                                value={traderData.token}
                                onChange={handleChange}
                                placeholder="Enter trading token"
                                required
                            />
                        </div>
                        <div className="w-full md:w-auto">
                            <Button
                                className="w-full"
                                type="submit"
                                variant="primary"
                                disabled={!traderData.token.trim()}
                            >
                                Start Copying
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="fixed top-0 left-0 right-0 flex justify-center pt-4 z-50">
                <Snackbar
                    isVisible={snackbar.isVisible}
                    message={snackbar.message}
                    status={snackbar.status}
                    hasCloseButton={true}
                    onCloseAction={handleSnackbarClose}
                    standalone={true}
                />
            </div>
        </>
    );
};

AddTraderForm.propTypes = {
    onAddTrader: PropTypes.func,
};

export default AddTraderForm;
