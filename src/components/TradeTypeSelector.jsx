import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Chip, Text } from "@deriv-com/quill-ui";
import useContractsForCompany from "../hooks/useContractsForCompany";

const defaultOption = {
    label: "Select a trade type",
    value: "",
};

const TradeTypeSelector = ({ selectedContracts = [], onChange }) => {
    const { contracts, isLoading, error } = useContractsForCompany();
    const [value, setValue] = useState(defaultOption);

    useEffect(() => console.log(contracts), [contracts]);

    // Create dropdown options from available contracts
    const dropdownOptions = [
        ...contracts.map((contract) => ({
            label: contract.contract_category_display,
            value: `${contract.barrier_category}_${contract.contract_category}`,
            disabled: selectedContracts.some(
                (c) =>
                    c.barrier_category === contract.barrier_category &&
                    c.contract_category === contract.contract_category
            ),
        })),
    ];

    const handleSelect = (option) => {
        // Handle undefined or empty value
        if (!option || !option.value) {
            setValue(defaultOption);
            return;
        }

        setValue(option);
        const [barrierCategory, contractCategory] = option.value.split("_");
        const selectedContract = contracts.find(
            (c) =>
                c.barrier_category === barrierCategory &&
                c.contract_category === contractCategory
        );

        // If contract found and not already selected
        if (
            selectedContract &&
            !selectedContracts.some(
                (c) =>
                    c.barrier_category === barrierCategory &&
                    c.contract_category === contractCategory
            )
        ) {
            // Create new contract with all sentiment information
            const newContract = {
                barrier_category: barrierCategory,
                contract_category: contractCategory,
                contract_category_display:
                    selectedContract.contract_category_display,
                sentiments: selectedContract.sentiments,
                // Default display values from first sentiment
                sentiment: Object.keys(selectedContract.sentiments)[0],
                contract_type:
                    selectedContract.sentiments[
                        Object.keys(selectedContract.sentiments)[0]
                    ].contract_type,
                contract_display:
                    selectedContract.sentiments[
                        Object.keys(selectedContract.sentiments)[0]
                    ].contract_display,
            };

            onChange?.([...selectedContracts, newContract]);
            setValue(defaultOption);
        }
    };

    const handleRemove = (contractToRemove) => {
        onChange?.(
            selectedContracts.filter(
                (contract) =>
                    !(
                        contract.barrier_category ===
                            contractToRemove.barrier_category &&
                        contract.contract_category ===
                            contractToRemove.contract_category
                    )
            )
        );
    };

    if (error) {
        return (
            <Text size="sm" className="text-red-600">
                Error loading contracts: {error}
            </Text>
        );
    }

    if (isLoading) {
        return <Text size="sm">Loading contracts...</Text>;
    }

    return (
        <div className="flex flex-col gap-4">
            <Text bold>Trade Types</Text>
            <Chip.SingleSelectDropdown
                defaultOption={defaultOption}
                value={value}
                options={dropdownOptions}
                onSelectionChange={handleSelect}
                size="md"
            />
            <div className="flex flex-wrap gap-2">
                {selectedContracts.length === 0 ? (
                    <Chip.Dismissible label="All" size="md" />
                ) : (
                    selectedContracts.map((contract) => (
                        <Chip.Dismissible
                            key={`${contract.barrier_category}_${contract.contract_category}`}
                            label={contract.contract_category_display}
                            onDismiss={() => handleRemove(contract)}
                            size="md"
                        />
                    ))
                )}
            </div>
        </div>
    );
};

TradeTypeSelector.propTypes = {
    selectedContracts: PropTypes.arrayOf(
        PropTypes.shape({
            barrier_category: PropTypes.string.isRequired,
            contract_category: PropTypes.string.isRequired,
            contract_category_display: PropTypes.string.isRequired,
            sentiment: PropTypes.string.isRequired,
            contract_type: PropTypes.string.isRequired,
            contract_display: PropTypes.string.isRequired,
            sentiments: PropTypes.object.isRequired,
        })
    ),
    onChange: PropTypes.func,
};

export default TradeTypeSelector;
