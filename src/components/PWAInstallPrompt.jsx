import { useState, useEffect } from 'react'

export default function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later
      setInstallPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsVisible(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return

    // Show the install prompt
    installPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsVisible(false)
      setInstallPrompt(null)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex items-center justify-between z-50">
      <div className="flex-1 mr-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">Install App</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Install our app for a better experience
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setIsVisible(false)}
          className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
        >
          Not now
        </button>
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Install
        </button>
      </div>
    </div>
  )
}