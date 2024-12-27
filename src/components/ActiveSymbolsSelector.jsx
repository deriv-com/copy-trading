import React from "react";
import PropTypes from "prop-types";
import { Chip, Text } from "@deriv-com/quill-ui";
import useActiveSymbols from "../hooks/useActiveSymbols";

const ActiveSymbolsSelector = ({ selectedSymbols = [], onChange }) => {
    const { symbols, error } = useActiveSymbols();
    const [selectedOption, setSelectedOption] = React.useState(null);

    const handleDropdownChange = (option) => {
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
        onChange?.(
            selectedSymbols.filter((symbol) => symbol.symbol !== symbolToRemove)
        );
    };

    // Filter out already selected symbols from dropdown options
    const availableSymbols = symbols
        .filter(
            (symbol) => !selectedSymbols.some((s) => s.symbol === symbol.symbol)
        )
        .map((symbol) => ({
            label: `${symbol.symbol} (${symbol.display_name})`,
            value: symbol.symbol,
        }));

    if (error) {
        return (
            <Text size="sm" className="text-red-600">
                Error loading symbols: {error}
            </Text>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <Text bold>Markets</Text>
            <Chip.SingleSelectDropdown
                defaultOption={{
                    label: "Select a symbol",
                    value: "",
                }}
                reset={true}
                value={selectedOption}
                onSelectionChange={handleDropdownChange}
                options={availableSymbols}
                size="md"
            />
            <div className="flex flex-wrap gap-2">
                {selectedSymbols.length === 0 ? (
                    <Chip.Dismissible label="All" size="md" />
                ) : (
                    selectedSymbols.map((symbol) => (
                        <Chip.Dismissible
                            key={symbol.symbol}
                            label={symbol.display_name}
                            onDismiss={() => handleRemoveSymbol(symbol.symbol)}
                            size="md"
                        />
                    ))
                )}
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
};

export default ActiveSymbolsSelector;
