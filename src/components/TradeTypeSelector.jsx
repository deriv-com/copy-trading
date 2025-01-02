import PropTypes from "prop-types";
import { Chip, Text } from "@deriv-com/quill-ui";
import useContractsForCompany from "../hooks/useContractsForCompany";

const defaultOption = {
    label: "Select a trade type",
    value: "",
};

const TradeTypeSelector = ({ selectedContracts = [], onChange }) => {
    const { contracts, isLoading, error } = useContractsForCompany();

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

    const dropdownOptions = contracts.map((contract) => ({
        label: contract.contract_category_display,
        value: Object.values(contract.sentiments).map(
            (sentiment) => sentiment.contract_type
        ),
    }));

    return (
        <div className="flex flex-col gap-4">
            <Text bold>Trade Types</Text>
            <div className="flex items-center gap-2">
                {selectedContracts.length === 0 ? (
                    <Chip.Dismissible label="All" size="md" />
                ) : (
                    selectedContracts.map((contract) => (
                        <Chip.Dismissible
                            key={`${contract.barrier_category}_${contract.contract_category}`}
                            label={contract.contract_category_display}
                            onDismiss={() => onChange([])}
                            size="md"
                        />
                    ))
                )}
                <Chip.SingleSelectDropdown
                    defaultOption={defaultOption}
                    value={defaultOption}
                    options={dropdownOptions}
                    onSelectionChange={onChange}
                    size="md"
                />
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
