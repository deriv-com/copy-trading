import { Button, Text, Link } from '@deriv-com/quill-ui'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDerivAccounts from '../hooks/useDerivAccounts'

const Login = () => {
    const APP_ID = '9999'
    // Force http for development, use normal origin for production
    const REDIRECT_URI = import.meta.env.DEV
        ? `http://${window.location.host}`
        : window.location.origin
    const navigate = useNavigate()
    const { defaultAccount, isLoading } = useDerivAccounts()

    useEffect(() => {
        // Only redirect after loading is complete and we have an account
        if (!isLoading && defaultAccount?.token) {
            navigate('/dashboard', { replace: true })
        }
    }, [defaultAccount, navigate, isLoading])

    // Show loading state or nothing while checking authentication
    if (isLoading) {
        return null // or return a loading spinner
    }

    const handleDerivLogin = () => {
        window.location.href = `https://qa10.deriv.dev/oauth2/authorize?app_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                <Text
                    as="h1"
                    size="2xl"
                    bold
                    centered
                    className="mb-6"
                >
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
                            Don't have an account?{' '}
                            <Link href="https://deriv.com/signup/" target="_blank" variant="primary">
                                Sign up with Deriv
                            </Link>
                        </Text>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login 
