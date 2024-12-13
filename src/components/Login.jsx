import { Button, Text, Link } from '@deriv-com/quill-ui'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDerivAccounts from '../hooks/useDerivAccounts'
import { getConfig } from '../config'

const Login = () => {
    const config = getConfig()

    console.log('OAuth Configuration:', {
        ...config,
        FINAL_URL: `${config.OAUTH_URL}/oauth2/authorize?app_id=${config.APP_ID}`
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
        window.location.href = `${config.OAUTH_URL}/oauth2/authorize?app_id=${config.APP_ID}`
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
