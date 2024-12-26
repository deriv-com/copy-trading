import { useState } from "react";
import PropTypes from "prop-types";
import useDerivAccounts from "../hooks/useDerivAccounts";

const AccountSelector = ({ defaultAccount, otherAccounts }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(defaultAccount);
    const { updateAccounts } = useDerivAccounts();

    const handleAccountSelect = (account) => {
        console.log("AccountSelector - Selecting account:", account);
        const filteredOtherAccounts = allAccounts.filter(acc => acc.account !== account.account);
        setSelectedAccount(account);
        console.log("AccountSelector - Calling updateAccounts with:", {
            newDefault: account,
            newOthers: filteredOtherAccounts
        });
        updateAccounts(account, filteredOtherAccounts);
        setIsOpen(false);
    };

    const allAccounts = [defaultAccount, ...otherAccounts];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                <span>
                    {selectedAccount.account}
                    {selectedAccount.currency && `(${selectedAccount.currency})`}
                </span>
                <svg
                    className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
                        }`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <ul className="py-1 max-h-60 overflow-auto">
                        {allAccounts.map((account) => (
                            <li
                                key={account.account}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${selectedAccount.account === account.account
                                    ? "bg-gray-50 text-gray-900"
                                    : "text-gray-700"
                                    }`}
                                onClick={() => handleAccountSelect(account)}
                            >
                                {account.account}
                                {account.currency && ` (${account.currency})`}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
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
};

export default AccountSelector;
