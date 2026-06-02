import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { apiRequest } from '../api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUserInfo, setUiError } = useContext(UserContext);

  async function login(ev) {
    ev.preventDefault();
    setIsSubmitting(true);
    try {
      const userInfo = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      });
      setUserInfo(userInfo);
      setUiError('');
      setRedirect(true);
    } catch (error) {
      setUiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }
  return (
    <form className="login" onSubmit={login}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Login'}</button>
    </form>
  );
}
