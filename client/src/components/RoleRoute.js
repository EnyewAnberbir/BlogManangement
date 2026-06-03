import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const roleRank = {
  reader: 1,
  author: 2,
  editor: 3,
  admin: 4
};

export default function RoleRoute({ children, minimumRole = 'editor' }) {
  const { userInfo, authChecked } = useContext(UserContext);

  if (!authChecked) return <p>Checking permissions...</p>;
  if (!userInfo?.id) return <Navigate to="/login" replace />;

  const current = roleRank[userInfo.role] || 0;
  const required = roleRank[minimumRole] || 0;
  if (current < required) {
    return <p>You do not have permission to view this page.</p>;
  }

  return children;
}
