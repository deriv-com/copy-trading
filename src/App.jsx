import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, SnackbarProvider, Spinner } from "@deriv-com/quill-ui";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PWAInstallBanner from "./components/PWAInstallBanner";

function App() {
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
            <div className="bg-gray-50">
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
                    <Route path="/*" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
