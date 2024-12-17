import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, SnackbarProvider } from "@deriv-com/quill-ui";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <ThemeProvider theme="light" persistent>
            <SnackbarProvider>
                <Router>
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
