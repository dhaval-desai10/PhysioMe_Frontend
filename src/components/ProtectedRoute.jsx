import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Redirect to the appropriate login page based on the route
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin/login" />;
    }
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.role === 'physiotherapist') {
      return <Navigate to="/therapist/dashboard" />;
    } else {
      return <Navigate to="/patient/dashboard" />;
    }
  }

  return children;
};

export default ProtectedRoute; 