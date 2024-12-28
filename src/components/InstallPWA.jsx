import { useState, useEffect } from 'react';
import { Button, Text } from '@deriv-com/quill-ui';

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const ios = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(ios);

    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
      setPromptInstall(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!promptInstall) return;
    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    if (outcome === 'accepted') {
      setSupportsPWA(false);
    }
  };

  if (!supportsPWA && !isIOS) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background-primary-base p-4 rounded-lg shadow-lg border border-opacity-100">
      <Text.Body size="sm" className="mb-2">
        {isIOS ? (
          <>
            Install this app on your iOS device: tap
            <span className="inline-flex items-center mx-1">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L19 9H15V19H9V9H5L12 2Z" />
              </svg>
            </span>
            and then "Add to Home Screen"
          </>
        ) : (
          'Install our app for a better experience'
        )}
      </Text.Body>
      {!isIOS && (
        <Button
          onClick={handleInstallClick}
          variant="primary"
          size="sm"
          className="w-full"
        >
          Install App
        </Button>
      )}
    </div>
  );
};

export default InstallPWA;
