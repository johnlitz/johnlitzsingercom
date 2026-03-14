import { type Entry, PLACEHOLDER_ENTRIES } from './types';

const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

export const isConfigured = Boolean(SUPABASE_URL);

export async function fetchEntries(): Promise<Entry[]> {
  if (!isConfigured) return PLACEHOLDER_ENTRIES;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/guestbook?select=id,name,message,created_at,signature,image,note_color,pin_color&approved=eq.true&order=created_at.desc&limit=50`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (res.ok) {
      const data = await res.json();
      return data.length > 0 ? data : PLACEHOLDER_ENTRIES;
    }
  } catch {
    // fall through
  }
  return PLACEHOLDER_ENTRIES;
}

export async function submitEntry(entry: {
  name: string;
  message: string;
  signature: string;
  image: string;
  note_color: string;
  pin_color: string;
}): Promise<boolean> {
  if (!isConfigured) return false;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/guestbook`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ ...entry, approved: false }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
