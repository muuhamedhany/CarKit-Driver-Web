import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import DriverSignup from './pages/DriverSignup';
import DriverDashboard from './pages/DriverDashboard';
import DriverActiveOrder from './pages/DriverActiveOrder';
import DriverHistory from './pages/DriverHistory';
import DriverProfile from './pages/DriverProfile';
import EmergencyDashboard from './pages/EmergencyDashboard';
import EmergencyActiveJob from './pages/EmergencyActiveJob';
import EmergencyHistory from './pages/EmergencyHistory';
import EmergencyProfile from './pages/EmergencyProfile';

function IndexRedirect() {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={role === 'driver' ? '/driver/dashboard' : '/emergency/dashboard'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<DriverSignup />} />
        <Route index element={<IndexRedirect />} />

        <Route element={<ProtectedRoute role="driver" />}>
          <Route path="/driver" element={<Layout mode="driver" />}>
            <Route index element={<Navigate to="/driver/dashboard" replace />} />
            <Route path="dashboard" element={<DriverDashboard />} />
            <Route path="active" element={<DriverActiveOrder />} />
            <Route path="history" element={<DriverHistory />} />
            <Route path="profile" element={<DriverProfile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="emergency_employee" />}>
          <Route path="/emergency" element={<Layout mode="emergency" />}>
            <Route index element={<Navigate to="/emergency/dashboard" replace />} />
            <Route path="dashboard" element={<EmergencyDashboard />} />
            <Route path="active" element={<EmergencyActiveJob />} />
            <Route path="history" element={<EmergencyHistory />} />
            <Route path="profile" element={<EmergencyProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
