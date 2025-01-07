import { useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth.jsx";
import { DropdownButton } from "@deriv-com/quill-ui";
import { LegacyLogout1pxIcon } from "@deriv/quill-icons";

const AccountSelector = ({
    defaultAccount,
    otherAccounts,
    onLogout,
    balances,
}) => {
    const [selectedAccount, setSelectedAccount] = useState(defaultAccount);
    const { updateAccounts } = useAuth();

    const handleAccountSelect = (account) => {
        console.log("AccountSelector - Selecting account:", account);
        const filteredOtherAccounts = allAccounts.filter(
            (acc) => acc.account !== account.account
        );
        setSelectedAccount(account);
        console.log("AccountSelector - Calling updateAccounts with:", {
            newDefault: account,
            newOthers: filteredOtherAccounts,
        });
        updateAccounts(account, filteredOtherAccounts);
    };

    const allAccounts = [defaultAccount, ...otherAccounts];

    const dropdownOptions = [
        ...allAccounts.map((account) => ({
            id: account.account,
            label: `${account.account} | ${
                balances[account.account]
                    ? `${balances[account.account].balance.toFixed(2)} ${
                          balances[account.account].currency
                      }`
                    : `0.00 ${account.currency}`
            }`,
            value: account.account,
            onClick: () => handleAccountSelect(account),
        })),
        {
            id: "logout",
            label: "",
            value: "logout",
            onClick: onLogout,
            leftIcon: <LegacyLogout1pxIcon fill="#000000" iconSize="xs" />,
        },
    ];

    return (
        <div className="max-w-fit [&_*]:max-w-fit">
            <DropdownButton
                actionSheetFooter={{
                    primaryAction: {
                        content: "Apply",
                        onAction: () => {},
                    },
                }}
                closeContentOnClick
                color="black"
                contentHeight="sm"
                contentTitle=""
                label={`${selectedAccount.account} | ${
                    balances[selectedAccount.account]
                        ? `${balances[selectedAccount.account].balance.toFixed(
                              2
                          )} ${balances[selectedAccount.account].currency}`
                        : `0.00 ${selectedAccount.currency}`
                }`}
                onClose={() => {}}
                onOpen={() => {}}
                onSelectionChange={(value) => {
                    const account = allAccounts.find(
                        (acc) => acc.account === value
                    );
                    if (account) handleAccountSelect(account);
                }}
                options={dropdownOptions}
                size="md"
                variant="secondary"
            />
        </div>
    );
};

AccountSelector.propTypes = {
    defaultAccount: PropTypes.shape({
        account: PropTypes.string.isRequired,
        currency: PropTypes.string,
    }).isRequired,
    otherAccounts: PropTypes.arrayOf(
        PropTypes.shape({
            account: PropTypes.string.isRequired,
            currency: PropTypes.string.isRequired,
        })
    ).isRequired,
    onLogout: PropTypes.func.isRequired,
    balances: PropTypes.objectOf(
        PropTypes.shape({
            balance: PropTypes.number.isRequired,
            currency: PropTypes.string.isRequired,
            loginid: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default AccountSelector;
