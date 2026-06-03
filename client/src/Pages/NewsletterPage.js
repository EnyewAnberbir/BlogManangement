import { useState } from 'react';
import { subscribeNewsletter } from '../services/blogApi';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      await subscribeNewsletter(email);
      setMessage('Subscribed successfully.');
      setEmail('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h1>Newsletter</h1>
      <p>Get weekly highlights from the editorial team.</p>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Subscribe'}
        </button>
      </form>
      {message ? <p>{message}</p> : null}
    </section>
  );
}
