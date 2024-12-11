import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDerivAccounts from '../hooks/useDerivAccounts'

const OAuthRedirect = () => {
    const navigate = useNavigate()
    const { updateAccounts } = useDerivAccounts()

    useEffect(() => {
        // Get URL parameters from either search or pathname+search
        const params = new URLSearchParams(window.location.search)

        // Extract default account (account1)
        const defaultAccount = {
            account: params.get('acct1'),
            currency: params.get('cur1'),
            token: params.get('token1')
        }

        // Extract other accounts
        const otherAccounts = []
        for (let i = 2; i <= 7; i++) {
            const account = params.get(`acct${i}`)
            const currency = params.get(`cur${i}`)
            const token = params.get(`token${i}`)

            if (account && currency && token) {
                otherAccounts.push({
                    account,
                    currency,
                    token
                })
            }
        }

        if (defaultAccount.token) {
            // Use the hook to update accounts
            updateAccounts(defaultAccount, otherAccounts)
            navigate('/dashboard', { replace: true })  // Use replace to prevent back navigation
        } else {
            navigate('/', { replace: true })
        }
    }, [navigate, updateAccounts])

    return null
}

export default OAuthRedirect 
