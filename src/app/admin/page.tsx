'use client';

import { useState } from 'react';
import Link from 'next/link';

interface UrlRow {
  id: number;
  code: string;
  original_url: string;
  clicks: number;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [urls, setUrls] = useState<UrlRow[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/urls', {
        headers: { 'x-admin-password': password },
      });

      if (res.status === 401) {
        setError('Invalid password');
        return;
      }

      if (!res.ok) {
        setError('Something went wrong');
        return;
      }

      const data = await res.json();
      setUrls(data.urls);
      setAuthenticated(true);
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    const res = await fetch('/api/admin/urls', {
      headers: { 'x-admin-password': password },
    });
    const data = await res.json();
    setUrls(data.urls);
  }

  if (!authenticated) {
    return (
      <div className="container">
        <nav>
          <Link href="/">Home</Link>
          <Link href="/admin">Admin</Link>
        </nav>

        <h1>🔐 Admin Login</h1>
        <p className="subtitle">Enter the admin password to continue.</p>

        <div className="card">
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Login'}
            </button>
          </form>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <nav>
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
      </nav>

      <h1>📊 Admin Dashboard</h1>
      <p className="subtitle">
        {urls.length} short URL{urls.length !== 1 ? 's' : ''} total.{' '}
        <button
          onClick={handleRefresh}
          style={{ background: 'none', color: '#4f46e5', padding: 0, fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer' }}
        >
          Refresh
        </button>
      </p>

      <div className="card">
        {urls.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No URLs shortened yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Original URL</th>
                <th>Clicks</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {urls.map((row) => (
                <tr key={row.id}>
                  <td>
                    <a href={`/${row.code}`} target="_blank" rel="noopener noreferrer">
                      {row.code}
                    </a>
                  </td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={row.original_url} target="_blank" rel="noopener noreferrer" title={row.original_url}>
                      {row.original_url}
                    </a>
                  </td>
                  <td>
                    <span className="badge">{row.clicks}</span>
                  </td>
                  <td style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    {new Date(row.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
