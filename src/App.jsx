import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, SnackbarProvider, Spinner } from "@deriv-com/quill-ui";
import useWebSocket from "./hooks/useWebSocket";
import Login from "./components/Login";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    const { isConnected } = useWebSocket();

    if (!isConnected) {
        return (
            <ThemeProvider theme="light" persistent>
                <div className="flex justify-center items-center h-screen">
                    <Spinner size="lg" />
                </div>
            </ThemeProvider>
        );
    }

    return (
        <ThemeProvider theme="light" persistent>
            <SnackbarProvider>
                <Router>
                    <Header />
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
                </Router>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;
