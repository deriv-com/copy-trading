import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import useDerivAccounts from '../hooks/useDerivAccounts'

const OAuthRedirect = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { updateAccounts } = useDerivAccounts()

    useEffect(() => {
        // Get the full URL including query parameters
        const currentUrl = window.location.href

        // Try both location.search and hash search params
        const urlParams = new URLSearchParams(window.location.search || location.search)
        const hashParams = new URLSearchParams(location.hash.replace('#', ''))

        console.log('OAuth Redirect Debug:', {
            currentUrl,
            urlSearch: window.location.search,
            locationSearch: location.search,
            hashSearch: location.hash,
            urlParams: Object.fromEntries(urlParams.entries()),
            hashParams: Object.fromEntries(hashParams.entries()),
            pathname: window.location.pathname,
            locationState: location.state
        })

        const accounts = []
        let defaultAccount = null

        // Iterate through params to find account data
        let index = 1
        while (urlParams.has(`acct${index}`) || hashParams.has(`acct${index}`)) {
            const account = {
                account: urlParams.get(`acct${index}`) || hashParams.get(`acct${index}`),
                token: urlParams.get(`token${index}`) || hashParams.get(`token${index}`),
                currency: urlParams.get(`cur${index}`) || hashParams.get(`cur${index}`)
            }
            console.log(`Found account ${index}:`, account)

            if (account.account && account.token) {
                accounts.push(account)
                // Set the first account as default
                if (index === 1) {
                    defaultAccount = account
                }
            }
            index++
        }

        console.log('Processed accounts:', {
            accounts,
            defaultAccount,
            hasAccounts: accounts.length > 0,
            accountsLength: accounts.length
        })

        // Only update if we found accounts
        if (accounts.length > 0) {
            console.log('Updating accounts and redirecting to dashboard')
            const otherAccounts = accounts.slice(1)
            updateAccounts(defaultAccount, otherAccounts)

            // Force a hard redirect to the hash route
            window.location.href = `${window.location.origin}/copy-trading/#/dashboard`
        } else {
            console.log('No accounts found, redirecting to login')
            window.location.href = `${window.location.origin}/copy-trading/#/login`
        }
    }, [location, navigate, updateAccounts])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg">Processing login...</div>
        </div>
    )
}

export default OAuthRedirect 
