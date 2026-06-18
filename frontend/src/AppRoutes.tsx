import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useStore } from './store/useStore';

// Simple placeholder page structures to bootstrap Phase 1
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BaggagePage from './pages/BaggagePage';
import NavigationPage from './pages/NavigationPage';
import SeatExchangePage from './pages/SeatExchangePage';
import ChatAssistantPage from './pages/ChatAssistantPage';
import AdminManagementPage from './pages/AdminManagementPage';
import StaffBaggagePage from './pages/StaffBaggagePage';
import Layout from './components/Layout';

const ProtectedRoute = () => {
  const user = useStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Passenger Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/baggage" element={<BaggagePage />} />
            <Route path="/navigation" element={<NavigationPage />} />
            <Route path="/seats" element={<SeatExchangePage />} />
            <Route path="/chat" element={<ChatAssistantPage />} />
            <Route path="/admin/manage" element={<AdminManagementPage />} />
            <Route path="/staff/baggage" element={<StaffBaggagePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
