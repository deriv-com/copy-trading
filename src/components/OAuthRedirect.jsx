import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDerivAccounts from '../hooks/useDerivAccounts'

const OAuthRedirect = () => {
    const navigate = useNavigate()
    const { updateAccounts } = useDerivAccounts()

    useEffect(() => {
        console.log('OAuth Redirect - Search params:', window.location.search)
        const params = new URLSearchParams(window.location.search)
        const accounts = []
        let defaultAccount = null

        // Iterate through params to find account data
        let index = 1
        while (params.has(`acct${index}`)) {
            const account = {
                account: params.get(`acct${index}`),
                token: params.get(`token${index}`),
                currency: params.get(`cur${index}`)
            }
            console.log(`Found account ${index}:`, account)
            accounts.push(account)

            // Set the first account as default
            if (index === 1) {
                defaultAccount = account
            }
            index++
        }

        console.log('Processed accounts:', accounts)
        // Only update if we found accounts
        if (accounts.length > 0) {
            console.log('Updating accounts and redirecting to dashboard')
            const otherAccounts = accounts.slice(1)
            updateAccounts(defaultAccount, otherAccounts)
            navigate('/dashboard', { replace: true })
        } else {
            console.log('No accounts found, redirecting to login')
            navigate('/login', { replace: true })
        }
    }, [navigate, updateAccounts])

    return <div>Processing login...</div> // Added visual feedback
}

export default OAuthRedirect 
