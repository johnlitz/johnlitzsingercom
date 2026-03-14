import { useState, useEffect } from 'react';
import { type Entry, NOTE_COLORS, PIN_COLORS } from './guestbook/types';
import { fetchEntries } from './guestbook/data';

function Thumbtack({ color }: { color: string }) {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" className="note-pin" aria-hidden="true">
      <circle cx="8" cy="6" r="5" fill={color} />
      <rect x="7" y="10" width="2" height="9" rx="1" fill="oklch(0.45 0.02 80)" />
      <circle cx="8" cy="6" r="2.5" fill="oklch(0.85 0.02 80)" opacity="0.5" />
    </svg>
  );
}

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
      <div className="gb-all-grid">
        {entries.map((entry, i) => {
          const hash = entry.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
          const rotation = ((hash % 7) - 3) * 0.5;
          const noteColor = entry.note_color || NOTE_COLORS[hash % NOTE_COLORS.length].value;
          const pinColor = entry.pin_color || PIN_COLORS[hash % PIN_COLORS.length].value;

          return (
            <div
              key={entry.id ?? i}
              className="sticky-note"
              style={{
                '--note-bg': noteColor,
                '--note-rotation': `${rotation}deg`,
              } as React.CSSProperties}
            >
              <Thumbtack color={pinColor} />
              <p className="note-message">{entry.message}</p>
              <span className="note-author">&mdash; {entry.name}</span>
              {entry.image && (
                <img src={entry.image} alt={`Photo by ${entry.name}`} className="note-image" />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .gb-entries-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          padding: var(--space-md) 0 var(--space-lg);
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
          margin-bottom: var(--space-md);
        }

        .gb-all-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-lg);
          width: 100%;
          max-width: 720px;
          padding: 0 var(--space-sm) var(--space-lg);
        }

        .sticky-note {
          position: relative;
          background: var(--note-bg, oklch(0.93 0.04 95));
          border-radius: 2px;
          padding: var(--space-lg) var(--space-md) var(--space-md);
          transform: rotate(var(--note-rotation, 0deg));
          box-shadow:
            0 1px 3px oklch(0.00 0.00 0 / 0.06),
            0 4px 12px oklch(0.00 0.00 0 / 0.04);
          transition: transform var(--duration-base) cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow var(--duration-base) ease;
        }

        .sticky-note:hover {
          transform: rotate(var(--note-rotation, 0deg)) translateY(-4px) scale(1.02);
          box-shadow:
            0 4px 8px oklch(0.00 0.00 0 / 0.08),
            0 12px 32px oklch(0.00 0.00 0 / 0.06);
        }

        .note-pin {
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          filter: drop-shadow(0 1px 2px oklch(0.30 0.00 0 / 0.25));
        }

        .note-message {
          font-size: var(--text-xs);
          color: oklch(0.25 0.00 0);
          line-height: 1.55;
          margin-bottom: var(--space-sm);
        }

        .note-author {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: oklch(0.40 0.00 0);
        }

        .note-image {
          margin-top: var(--space-sm);
          max-width: 100%;
          max-height: 100px;
          border-radius: 4px;
          object-fit: cover;
        }

        @media (max-width: 600px) {
          .gb-all-grid {
            grid-template-columns: 1fr;
            max-width: 280px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sticky-note {
            transition: none;
          }
          .sticky-note:hover {
            transform: rotate(var(--note-rotation, 0deg));
          }
        }
      `}</style>
    </div>
  );
}
