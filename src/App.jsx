import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, SnackbarProvider, Spinner } from "@deriv-com/quill-ui";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import Login from "./components/Login";
import EndpointSettings from "./components/EndpointSettings";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PWAInstallBanner from "./components/PWAInstallBanner";
import {
    getStoredEndpointSettings,
    setEndpointSettings,
    getDefaultServer,
    getDefaultAppId,
} from "./config/index.js";

function App() {
    useEffect(() => {
        try {
            const storedSettings = getStoredEndpointSettings();
            if (!storedSettings) {
                setEndpointSettings(getDefaultServer(), getDefaultAppId());
            }
        } catch (error) {
            console.error(
                "Failed to access storage for endpoint settings:",
                error
            );
            // Ensure app can still function by using defaults without storing them
            const defaultServer = getDefaultServer();
            const defaultAppId = getDefaultAppId();
            try {
                setEndpointSettings(defaultServer, defaultAppId);
            } catch (storageError) {
                console.error(
                    "Failed to store default endpoint settings:",
                    storageError
                );
            }
        }
    }, []);

    return (
        <ThemeProvider theme="light" persistent>
            <SnackbarProvider>
                <AuthProvider>
                    <AppContent />
                </AuthProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

function AppContent() {
    const { isConnected } = useAuth();

    if (!isConnected) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <Router>
            <div className="bg-gray-50 min-h-screen">
                <Header />
                <PWAInstallBanner />
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/endpoint" element={<EndpointSettings />} />
                    <Route path="/*" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
