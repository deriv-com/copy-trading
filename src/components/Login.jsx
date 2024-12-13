import { Button, Text, Link } from '@deriv-com/quill-ui'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDerivAccounts from '../hooks/useDerivAccounts'

// Production fallback values
const PROD_APP_ID = '66435'
const PROD_OAUTH_URL = 'https://oauth.deriv.com'

const Login = () => {
    // Use env variables with fallback to production values
    const APP_ID = import.meta.env.VITE_APP_ID || PROD_APP_ID
    const OAUTH_URL = import.meta.env.VITE_OAUTH_URL || PROD_OAUTH_URL

    console.log('OAuth Configuration:', {
        APP_ID,
        OAUTH_URL,
        FINAL_URL: `${OAUTH_URL}/oauth2/authorize?app_id=${APP_ID}`
    })

    const navigate = useNavigate()
    const { defaultAccount, isLoading } = useDerivAccounts()

    useEffect(() => {
        if (!isLoading && defaultAccount?.token) {
            navigate('/dashboard', { replace: true })
        }
    }, [defaultAccount, navigate, isLoading])

    if (isLoading) {
        return null
    }

    const handleDerivLogin = () => {
        window.location.href = `${OAUTH_URL}/oauth2/authorize?app_id=${APP_ID}`
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
