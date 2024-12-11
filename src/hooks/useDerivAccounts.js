import { useState, useEffect } from 'react'

const useDerivAccounts = () => {
    const [defaultAccount, setDefaultAccount] = useState(null)
    const [otherAccounts, setOtherAccounts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Load accounts from localStorage when hook is initialized
    useEffect(() => {
        try {
            const storedDefault = localStorage.getItem('deriv_default_account')
            const storedOthers = localStorage.getItem('deriv_other_accounts')

            if (storedDefault) {
                setDefaultAccount(JSON.parse(storedDefault))
            }
            if (storedOthers) {
                setOtherAccounts(JSON.parse(storedOthers))
            }
        } catch (error) {
            console.error('Error loading accounts:', error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Function to update accounts
    const updateAccounts = (newDefault, newOthers) => {
        // Update state
        setDefaultAccount(newDefault)
        setOtherAccounts(newOthers)

        // Update localStorage
        localStorage.setItem('deriv_default_account', JSON.stringify(newDefault))
        localStorage.setItem('deriv_other_accounts', JSON.stringify(newOthers))
    }

    // Function to clear accounts (for logout)
    const clearAccounts = () => {
        setDefaultAccount(null)
        setOtherAccounts([])
        localStorage.removeItem('deriv_default_account')
        localStorage.removeItem('deriv_other_accounts')
    }

    return {
        defaultAccount,
        otherAccounts,
        updateAccounts,
        clearAccounts,
        isLoading
    }
}

export default useDerivAccounts 
