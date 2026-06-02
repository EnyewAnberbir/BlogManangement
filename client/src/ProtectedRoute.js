import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function ProtectedRoute({ children }) {
  const { userInfo, authChecked } = useContext(UserContext);

  if (!authChecked) {
    return <p>Checking authentication...</p>;
  }

  if (!userInfo?.id) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
