import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from './UserContext';
import { apiRequest } from './api';

export default function Header() {
  const { setUserInfo, userInfo, refreshProfile, setUiError } = useContext(UserContext);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  async function logout() {
    try {
      await apiRequest('/logout', { method: 'POST' });
      setUserInfo(null);
      setUiError('');
    } catch (error) {
      setUiError(error.message);
    }
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        Blog-Post
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
