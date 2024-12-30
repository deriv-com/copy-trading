import { Spinner, Text, Button } from "@deriv-com/quill-ui";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import { getConfig } from "../config";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { defaultAccount, isLoading, updateAccounts } = useAuth();
    const config = getConfig();

    useEffect(() => {
        // Handle OAuth redirect logic
        const currentUrl = window.location.href;
        const urlParams = new URLSearchParams(
            window.location.search || location.search
        );
        const hashParams = new URLSearchParams(location.hash.replace("#", ""));

        console.log("OAuth Redirect Debug:", {
            currentUrl,
            urlSearch: window.location.search,
            locationSearch: location.search,
            hashSearch: location.hash,
            urlParams: Object.fromEntries(urlParams.entries()),
            hashParams: Object.fromEntries(hashParams.entries()),
            pathname: window.location.pathname,
            locationState: location.state,
        });

        const accounts = [];
        let defaultAcct = null;

        // Iterate through params to find account data
        let index = 1;
        while (
            urlParams.has(`acct${index}`) ||
            hashParams.has(`acct${index}`)
        ) {
            const account = {
                account:
                    urlParams.get(`acct${index}`) ||
                    hashParams.get(`acct${index}`),
                token:
                    urlParams.get(`token${index}`) ||
                    hashParams.get(`token${index}`),
                currency:
                    urlParams.get(`cur${index}`) ||
                    hashParams.get(`cur${index}`),
            };
            console.log(`Found account ${index}:`, account);

            if (account.account && account.token) {
                accounts.push(account);
                if (index === 1) {
                    defaultAcct = account;
                }
            }
            index++;
        }

        // Handle accounts if found in OAuth redirect
        if (accounts.length > 0) {
            console.log("Updating accounts and redirecting to dashboard");
            const otherAccounts = accounts.slice(1);
            updateAccounts(defaultAcct, otherAccounts);
            window.location.href = `${window.location.origin}/copy-trading/#/dashboard`;
            return;
        }

        // Regular login flow - redirect if already logged in
        if (!isLoading && defaultAccount?.token) {
            navigate("/dashboard", { replace: true });
        }
    }, [defaultAccount, navigate, isLoading, location, updateAccounts]);

    const showSpinner =
        (isLoading ||
            window.location.search ||
            window.location.hash.includes("acct")) &&
        !defaultAccount?.token;

    return (
        <div className="min-h-screen">
            {showSpinner ? (
                <div className="flex items-center justify-center min-h-screen">
                    <Spinner size="lg" />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-8 lg:px-16 text-center">
                    <Text as="h1" size="6xl" className="font-bold mb-6 max-w-3xl text-[2.5rem] md:text-[3.5rem] lg:text-[4rem]">
                        Deriv: Where Smart Traders Copy Smarter
                    </Text>
                    <Text size="lg" className="mt-6 mb-12 max-w-2xl text-gray-600">
                        Mirror the success of top traders automatically. Set up in minutes
                    </Text>
                    <Button 
                        variant="primary"
                        size="lg"
                        className="mt-6"
                        onClick={() => window.location.href = `${config.OAUTH_URL}/oauth2/authorize?app_id=${config.APP_ID}`}
                    >
                        Get started
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Login;
