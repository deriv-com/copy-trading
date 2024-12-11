import { Text, RadioGroup, RadioButton } from '@deriv-com/quill-ui'

const Header = ({ defaultAccount, accountOptions, onAccountChange, onLogout }) => {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Text
                        as="h1"
                        size="lg"
                        bold
                        color="prominent"
                    >
                        Deriv App
                    </Text>

                    <div className="flex items-center space-x-6">
                        <div className="relative group">
                            <button
                                className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-50"
                            >
                                <Text color="prominent">
                                    {defaultAccount?.account} ({defaultAccount?.currency})
                                </Text>
                                <svg
                                    className="w-5 h-5 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown content */}
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                                <div className="p-4">
                                    <Text
                                        size="sm"
                                        color="prominent"
                                        bold
                                        className="mb-3"
                                    >
                                        Select Account
                                    </Text>
                                    <div className="space-y-2">
                                        {accountOptions.map(option => (
                                            <div
                                                key={option.value}
                                                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                                onClick={() => onAccountChange(option.value)}
                                            >
                                                <input
                                                    type="radio"
                                                    checked={option.value === defaultAccount?.account}
                                                    onChange={() => { }}
                                                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                                />
                                                <Text
                                                    color="general"
                                                    size="sm"
                                                    className="ml-3"
                                                >
                                                    {option.label}
                                                </Text>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onLogout}
                            className="py-2 px-3 rounded-md hover:bg-gray-50"
                        >
                            <Text color="error">
                                Logout
                            </Text>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header 
