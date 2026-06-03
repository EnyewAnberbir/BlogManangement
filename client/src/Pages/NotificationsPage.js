import { useEffect, useState } from 'react';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from '../services/blogApi';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    try {
      const payload = await fetchNotifications();
      setNotifications(payload.items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function readOne(id) {
    await markNotificationRead(id);
    await reload();
  }

  async function readAll() {
    await markAllNotificationsRead();
    await reload();
  }

  if (loading) return <p>Loading notifications...</p>;

  return (
    <section>
      <header>
        <h1>Notifications</h1>
        <button type="button" onClick={readAll}>
          Mark all read
        </button>
      </header>
      <ul className="notification-list">
        {notifications.map((entry) => (
          <li key={entry._id} className={entry.readAt ? 'read' : 'unread'}>
            <strong>{entry.title}</strong>
            <p>{entry.body}</p>
            {!entry.readAt ? (
              <button type="button" onClick={() => readOne(entry._id)}>
                Mark read
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
