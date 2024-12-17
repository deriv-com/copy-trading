import { useState } from "react";
import { Text, Button, TextField } from "@deriv-com/quill-ui";
import PropTypes from "prop-types";

const AddTraderForm = ({ onAddTrader }) => {
    const [traderData, setTraderData] = useState({
        id: "",
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Get existing traders from localStorage or initialize empty array
        const existingTraders = JSON.parse(
            localStorage.getItem("traders") || "[]"
        );

        // Add new trader if ID not already in the list
        if (!existingTraders.some((trader) => trader.id === traderData.id)) {
            const updatedTraders = [...existingTraders, traderData];
            localStorage.setItem("traders", JSON.stringify(updatedTraders));
            onAddTrader?.(traderData);
        }

        // Clear form after submission
        setTraderData({ id: "", name: "" });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTraderData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
            <Text size="xl" bold className="mb-4">
                Add New Trader
            </Text>
            <form onSubmit={handleSubmit}>
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <TextField
                            label="Trader Name"
                            name="name"
                            value={traderData.name}
                            onChange={handleChange}
                            placeholder="Enter trader's name"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <TextField
                            label="Trader ID"
                            name="id"
                            value={traderData.id}
                            onChange={handleChange}
                            placeholder="Enter trader's token"
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={
                            !traderData.id.trim() || !traderData.name.trim()
                        }
                    >
                        Add Trader
                    </Button>
                </div>
            </form>
        </div>
    );
};

AddTraderForm.propTypes = {
    onAddTrader: PropTypes.func,
};

export default AddTraderForm;
