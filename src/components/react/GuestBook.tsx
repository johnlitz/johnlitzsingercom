import { useState, useEffect, useRef } from 'react';

interface Entry {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export default function GuestBook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    if (!SUPABASE_URL) return;
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/guestbook?select=id,name,message,created_at&order=created_at.desc&limit=50`,
        { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (res.ok) setEntries(await res.json());
    } catch {
      // Silent fail — guest book entries just won't show
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (honeypotRef.current?.value) return; // Bot detected
    if (!name.trim() || !message.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/guestbook`,
        {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify({ name: name.trim(), message: message.trim() }),
        }
      );

      if (res.ok) {
        const [newEntry] = await res.json();
        setEntries((prev) => [newEntry, ...prev]);
        setName('');
        setMessage('');
      } else {
        setError('Failed to sign. Try again.');
      }
    } catch {
      setError('Failed to sign. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="gb-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          maxLength={100}
          className="gb-input"
        />
        {/* Honeypot */}
        <input
          ref={honeypotRef}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Leave a message..."
          required
          maxLength={500}
          rows={3}
          className="gb-textarea"
        />
        {error && <p className="gb-error">{error}</p>}
        <button type="submit" disabled={submitting} className="gb-submit">
          {submitting ? 'Signing...' : 'Sign'}
        </button>
      </form>

      <div className="gb-entries">
        {entries.map((entry) => (
          <div key={entry.id} className="gb-entry">
            <div className="gb-entry-header">
              <span className="gb-entry-name">{entry.name}</span>
              <time className="gb-entry-date">
                {new Date(entry.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
            <p className="gb-entry-message">{entry.message}</p>
          </div>
        ))}
      </div>

      {!SUPABASE_URL && (
        <p style={{ color: 'var(--muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-lg)' }}>
          Guest book coming soon — backend not yet configured.
        </p>
      )}
    </div>
  );
}
