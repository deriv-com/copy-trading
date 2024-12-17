import { Button, Text, Link } from "@deriv-com/quill-ui";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useDerivAccounts from "../hooks/useDerivAccounts";
import { getConfig } from "../config";

const Login = () => {
    const config = getConfig();
    const navigate = useNavigate();
    const location = useLocation();
    const { defaultAccount, isLoading, updateAccounts } = useDerivAccounts();

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

    if (
        isLoading ||
        window.location.search ||
        window.location.hash.includes("acct")
    ) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Processing login...</div>
            </div>
        );
    }

    const handleDerivLogin = () => {
        window.location.href = `${config.OAUTH_URL}/oauth2/authorize?app_id=${config.APP_ID}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <Text as="h1" size="2xl" bold centered className="mb-6">
                    Login to your account
                </Text>

                <div className="space-y-6">
                    <Button
                        type="button"
                        variant="primary"
                        fullWidth
                        onClick={handleDerivLogin}
                    >
                        Login with Deriv
                    </Button>

                    <div className="text-center">
                        <Text size="sm">
                            Don't have an account?{" "}
                            <Link
                                href="https://deriv.com/signup/"
                                target="_blank"
                                variant="primary"
                            >
                                Sign up with Deriv
                            </Link>
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
