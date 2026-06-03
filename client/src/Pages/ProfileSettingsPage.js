import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { fetchAuthorInsights, fetchFollowing, updateProfile } from '../services/blogApi';

export default function ProfileSettingsPage() {
  const { userInfo, setUserInfo, setUiError } = useContext(UserContext);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [insights, setInsights] = useState(null);
  const [following, setFollowing] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDisplayName(userInfo?.displayName || userInfo?.username || '');
    setBio(userInfo?.bio || '');
    Promise.all([fetchAuthorInsights(), fetchFollowing()])
      .then(([stats, authors]) => {
        setInsights(stats);
        setFollowing(authors);
      })
      .catch((error) => setUiError(error.message));
  }, [userInfo, setUiError]);

  async function onSave(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const profile = await updateProfile({ displayName, bio });
      setUserInfo({ ...userInfo, ...profile });
      setUiError('');
    } catch (error) {
      setUiError(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="profile-settings">
      <h1>Profile settings</h1>
      <form onSubmit={onSave}>
        <label>
          Display name
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        </label>
        <label>
          Bio
          <textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={4} />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>

      {insights ? (
        <div className="profile-insights">
          <h2>Author insights</h2>
          <p>Posts: {insights.posts}</p>
          <p>Published: {insights.published}</p>
          <p>Drafts: {insights.drafts}</p>
          <p>Total views: {insights.views}</p>
        </div>
      ) : null}

      <div>
        <h2>Following</h2>
        {following.length === 0 ? (
          <p>You are not following any authors yet.</p>
        ) : (
          <ul>
            {following.map((entry) => (
              <li key={entry._id}>{entry.author?.username}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
