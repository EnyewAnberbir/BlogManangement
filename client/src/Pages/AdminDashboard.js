import { useContext, useEffect, useMemo, useState } from 'react';
import { UserContext } from '../UserContext';
import {
  fetchAdminDashboard,
  fetchNewsletterStats,
  runWeeklyDigest
} from '../services/blogApi';
import StatCard from '../components/admin/StatCard';
import TrendList from '../components/admin/TrendList';
import LeaderboardTable from '../components/admin/LeaderboardTable';
import AuditFeed from '../components/admin/AuditFeed';

export default function AdminDashboard() {
  const { setUiError } = useContext(UserContext);
  const [dashboard, setDashboard] = useState(null);
  const [newsletter, setNewsletter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [runningDigest, setRunningDigest] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAdminDashboard(), fetchNewsletterStats()])
      .then(([dash, stats]) => {
        setDashboard(dash);
        setNewsletter(stats);
        setUiError('');
      })
      .catch((error) => setUiError(error.message))
      .finally(() => setLoading(false));
  }, [setUiError]);

  const statCards = useMemo(() => {
    if (!dashboard) return [];
    return [
      { label: 'Posts', value: dashboard.totals.posts, hint: `${dashboard.week.posts} this week` },
      {
        label: 'Comments',
        value: dashboard.totals.comments,
        hint: `${dashboard.week.comments} this week`
      },
      { label: 'Users', value: dashboard.totals.users, hint: `${dashboard.week.users} this week` },
      {
        label: 'Pending moderation',
        value: dashboard.moderation.pendingComments + dashboard.moderation.draftPosts,
        hint: `${dashboard.moderation.pendingComments} comments · ${dashboard.moderation.draftPosts} drafts`
      }
    ];
  }, [dashboard]);

  async function triggerDigest() {
    setRunningDigest(true);
    try {
      await runWeeklyDigest();
      setUiError('');
    } catch (error) {
      setUiError(error.message);
    } finally {
      setRunningDigest(false);
    }
  }

  if (loading) return <p>Loading admin dashboard...</p>;
  if (!dashboard) return <p>Dashboard unavailable.</p>;

  return (
    <section className="admin-dashboard">
      <header className="admin-header">
        <h1>Editorial dashboard</h1>
        <button type="button" onClick={triggerDigest} disabled={runningDigest}>
          {runningDigest ? 'Running digest...' : 'Run weekly digest'}
        </button>
      </header>

      <div className="admin-stat-grid">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
        {newsletter ? (
          <StatCard
            label="Newsletter subscribers"
            value={newsletter.activeSubscribers}
            hint="Active audience"
          />
        ) : null}
      </div>

      <div className="admin-panels">
        <TrendList title="Publishing trend" rows={dashboard.publishTrend} />
        <TrendList title="Comment trend" rows={dashboard.commentTrend} />
      </div>

      <LeaderboardTable rows={dashboard.leaderboard} />
      <AuditFeed events={dashboard.auditTrail} />
    </section>
  );
}
