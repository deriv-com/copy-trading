import PropTypes from "prop-types";
import { Chip, Text } from "@deriv-com/quill-ui";
import useActiveSymbols from "../hooks/useActiveSymbols";
import React from "react";

const ActiveSymbolsSelector = ({ selectedSymbols = [], onChange, isDisabled }) => {
    const { symbols, error } = useActiveSymbols();
    const [selectedOption, setSelectedOption] = React.useState(null);

    const options = symbols.map((symbol) => ({
        label: symbol.display_name,
        value: symbol.symbol,
        disabled: isDisabled,
    }));

    const handleDropdownChange = (option) => {
        if (isDisabled) return;
        
        if (option?.value) {
            const selectedSymbol = symbols.find(
                (s) => s.symbol === option.value
            );
            if (
                selectedSymbol &&
                !selectedSymbols.some((s) => s.symbol === selectedSymbol.symbol)
            ) {
                onChange?.([
                    ...selectedSymbols,
                    {
                        symbol: selectedSymbol.symbol,
                        display_name: selectedSymbol.display_name,
                    },
                ]);
                setSelectedOption(null);
            }
        }
    };

    const handleRemoveSymbol = (symbolToRemove) => {
        if (isDisabled) return;
        
        onChange?.(
            selectedSymbols.filter((symbol) => symbol.symbol !== symbolToRemove)
        );
    };

    if (error) {
        return (
            <Text size="sm" className="text-red-600">
                Error loading symbols: {error}
            </Text>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <Text bold>Markets</Text>
            <div className="flex gap-4">
                <div className="flex flex-wrap gap-2">
                    {selectedSymbols.length === 0 ? (
                        <Chip.Dismissible label="All" size="md" disabled={isDisabled} />
                    ) : (
                        selectedSymbols.map((symbol) => (
                            <Chip.Dismissible
                                key={symbol.symbol}
                                label={symbol.display_name}
                                onDismiss={() =>
                                    handleRemoveSymbol(symbol.symbol)
                                }
                                size="md"
                                disabled={isDisabled}
                            />
                        ))
                    )}
                </div>
                <div className="max-h-[32px] z-50">
                    <Chip.SingleSelectDropdown
                        defaultOption={{
                            label: "Select a symbol",
                            value: "",
                        }}
                        reset={!isDisabled}
                        value={selectedOption}
                        onSelectionChange={handleDropdownChange}
                        options={options}
                        size="md"
                        disabled={isDisabled}
                    />
                </div>
            </div>
        </div>
    );
};

ActiveSymbolsSelector.propTypes = {
    selectedSymbols: PropTypes.arrayOf(
        PropTypes.shape({
            symbol: PropTypes.string.isRequired,
            display_name: PropTypes.string.isRequired,
        })
    ),
    onChange: PropTypes.func,
    isDisabled: PropTypes.bool,
};

export default ActiveSymbolsSelector;
