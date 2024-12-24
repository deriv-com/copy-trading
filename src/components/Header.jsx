import { useState } from "react";
import { Text, Button } from "@deriv-com/quill-ui";
import useDerivAccounts from "../hooks/useDerivAccounts";
import { getConfig } from "../config";
import derivIcon from "../assets/deriv-icon.svg";

const Header = () => {
    const { defaultAccount, otherAccounts, clearAccounts } = useDerivAccounts();
    const config = getConfig();
    const [showAccounts, setShowAccounts] = useState(false);

    const handleLogout = () => {
        clearAccounts();
        window.location.href = "/";
    };

    const handleDerivLogin = () => {
        window.location.href = `${config.OAUTH_URL}/oauth2/authorize?app_id=${config.APP_ID}`;
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center gap-2">
                            <img
                                src={derivIcon}
                                alt="Deriv"
                                className="w-6 h-6"
                            />
                            <Text size="lg" bold>
                                Copy Trading
                            </Text>
                        </div>
                        {defaultAccount && (
                            <div className="relative">
                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        setShowAccounts(!showAccounts)
                                    }
                                >
                                    {defaultAccount.account}
                                </Button>

                                {showAccounts && otherAccounts?.length > 0 && (
                                    <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1">
                                            {otherAccounts.map((account) => (
                                                <button
                                                    key={account.account}
                                                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    {account.account} (
                                                    {account.currency})
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {defaultAccount ? (
                        <Button variant="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={handleDerivLogin}>
                            Log in
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
