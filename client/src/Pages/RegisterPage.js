import { useContext, useState } from 'react';
import { apiRequest } from '../api';
import { UserContext } from '../UserContext';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUiError } = useContext(UserContext);

  async function register(ev) {
    ev.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest('/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      });
      setUiError('');
      alert('registration successful');
    } catch (error) {
      setUiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
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
      <button disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register'}</button>
    </form>
  );
}
