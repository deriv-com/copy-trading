import { useState, useEffect } from 'react';
import { Button, Text, Heading } from '@deriv-com/quill-ui';

const PWAInstallBanner = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [installable, setInstallable] = useState(false);

    useEffect(() => {
        // Check if the app is already in standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
            || window.navigator.standalone 
            || document.referrer.includes('android-app://');
            
        console.log('📱 Is app in standalone mode:', isStandalone);

        if (isStandalone) {
            console.log('App is already installed, hiding banner');
            setIsVisible(false);
            return;
        }

        // Handle the beforeinstallprompt event first
        const handleBeforeInstallPrompt = (e) => {
            console.log('👋 beforeinstallprompt event was fired');
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            setInstallable(true);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if the app is installable as a fallback
        const checkInstallability = async () => {
            // Don't show install prompt if we already captured beforeinstallprompt
            if (deferredPrompt) return;

            const supportsInstall = 'serviceWorker' in navigator;
            
            if (supportsInstall) {
                console.log('✅ App has service worker support');
                setInstallable(false); // Only set true when we have the actual prompt
                setIsVisible(true); // Show banner with manual instructions
            } else {
                console.log('❌ App installation not supported');
            }

            // Check for related apps
            if ('getInstalledRelatedApps' in navigator) {
                const relatedApps = await navigator.getInstalledRelatedApps();
                console.log('🔍 Related apps:', relatedApps);
                
                if (relatedApps.length > 0) {
                    setIsVisible(false);
                }
            }
        };

        // Small delay to allow beforeinstallprompt to fire first
        setTimeout(checkInstallability, 1000);

        // Handle successful installation
        const handleAppInstalled = () => {
            console.log('🎉 PWA was installed');
            setIsVisible(false);
            setInstallable(false);
            setDeferredPrompt(null);
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            // Show manual installation instructions
            console.log('ℹ️ No install prompt available, showing manual instructions');
            return;
        }

        console.log('📲 Triggering install prompt');
        try {
            // Show the prompt
            await deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`👤 User response to install prompt: ${outcome}`);
            
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
                setIsVisible(false);
                setInstallable(false);
            }
        } catch (error) {
            console.error('❌ Error during installation:', error);
            // Keep the prompt for retry
            setIsVisible(true);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-lg shadow-lg p-5 border border-gray-200 z-50 transition-all duration-300 ease-in-out transform hover:shadow-xl animate-slideIn">
            <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                    <Heading.H4 className="mb-2">Install Deriv Copy Trading</Heading.H4>
                    <Text className="text-gray-600">
                        {installable ? (
                            "Get instant access to your trading activities, faster loading times, and a seamless experience - even offline!"
                        ) : (
                            "Add to your home screen for quick access and enhanced features. Open this website in Chrome or Safari for the best experience."
                        )}
                    </Text>
                    <div className="flex gap-3 mt-4">
                        <Button
                            variant="primary"
                            onClick={handleInstallClick}
                            className="flex-1 md:flex-none px-4 py-3"
                        >
                            {installable ? "Install Now" : "Add to Home Screen"}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setIsVisible(false)}
                            className="flex-1 md:flex-none px-4 py-3"
                        >
                            Maybe Later
                        </Button>
                    </div>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default PWAInstallBanner;
