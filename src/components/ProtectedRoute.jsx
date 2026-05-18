import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ role }) {
  const { loading, isAuthenticated, role: currentRole } = useAuth();

  if (loading) return <div className="screen-center">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && currentRole !== role) {
    return <Navigate to={currentRole === 'driver' ? '/driver/dashboard' : '/emergency/dashboard'} replace />;
  }
  return <Outlet />;
}
