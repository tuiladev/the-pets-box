import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PreloaderProvider } from './context/PreloaderContext';
import Layout from './layout/Layout';
import Auth from './components/features/Auth';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import ProtectedRoute from './components/features/ProtectedRoute';

const App = () => {
    return (
        <BrowserRouter>
            <PreloaderProvider>
                <Routes>
                    {/* Auth routes - nằm ngoài Layout */}
                    <Route path="auth" element={<Auth />} />

                    {/* Các route khác nằm trong Layout */}
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />

                        {/* Protected routes */}
                        <Route
                            path="account"
                            element={
                                <ProtectedRoute>
                                    <Navigate to="/account/profile" replace />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="account/:section"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 route */}
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </PreloaderProvider>
        </BrowserRouter>
    );
};

export default App;
