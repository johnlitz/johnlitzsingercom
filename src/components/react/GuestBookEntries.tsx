import { useState, useEffect } from 'react';
import { type Entry } from './guestbook/types';
import { fetchEntries } from './guestbook/data';

export default function GuestBookEntries() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="gb-loading">Loading entries...</p>;
  }

  return (
    <div className="gb-entries-layout">
      <h2 className="gb-all-title">All Entries</h2>
      <ul className="gb-entries-list">
        {entries.map((entry, i) => (
          <li key={entry.id ?? i} className="gb-entry-item">
            <p className="gb-entry-message">{entry.message}</p>
            <span className="gb-entry-author">&mdash; {entry.name}</span>
          </li>
        ))}
      </ul>

      <style>{`
        .gb-entries-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: 0 0 var(--space-lg);
        }

        .gb-loading {
          font-size: var(--text-sm);
          color: var(--muted);
          text-align: center;
          padding: var(--space-lg);
        }

        .gb-all-title {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--guestbook-500);
          letter-spacing: -0.01em;
          margin-bottom: var(--space-sm);
        }

        .gb-entries-list {
          list-style: none;
          width: 100%;
          max-width: 540px;
          padding: 0;
          margin: 0;
        }

        .gb-entry-item {
          padding: var(--space-sm) 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        .gb-entry-message {
          font-size: var(--text-sm);
          color: var(--foreground);
          line-height: 1.5;
          margin-bottom: 2px;
        }

        .gb-entry-author {
          font-size: var(--text-xs);
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}
