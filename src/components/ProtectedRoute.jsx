import { Navigate } from 'react-router-dom'
import useDerivAccounts from '../hooks/useDerivAccounts'

const ProtectedRoute = ({ children }) => {
    const { defaultAccount, isLoading } = useDerivAccounts()

    // Show nothing while checking authentication
    if (isLoading) {
        return null // or return a loading spinner
    }

    if (!defaultAccount?.token) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute 
