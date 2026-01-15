import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // 1. If Firebase is still checking the login status, show a loader
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader-spinner"></div>
      </div>
    );
  }

  // 2. If loading is done and there is NO user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If there is a user, let them through
  return children;
};

export default ProtectedRoute;