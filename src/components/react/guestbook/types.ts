export const NOTE_COLORS = [
  { name: 'Lemon', value: 'oklch(0.93 0.04 95)' },
  { name: 'Blush', value: 'oklch(0.93 0.04 15)' },
  { name: 'Sky', value: 'oklch(0.93 0.04 240)' },
  { name: 'Mint', value: 'oklch(0.93 0.04 160)' },
  { name: 'Lavender', value: 'oklch(0.93 0.04 300)' },
  { name: 'Peach', value: 'oklch(0.93 0.04 55)' },
] as const;

export const PIN_COLORS = [
  { name: 'Red', value: 'oklch(0.65 0.20 25)' },
  { name: 'Blue', value: 'oklch(0.65 0.17 264)' },
  { name: 'Green', value: 'oklch(0.65 0.17 152)' },
  { name: 'Gold', value: 'oklch(0.65 0.17 80)' },
  { name: 'Purple', value: 'oklch(0.65 0.17 295)' },
  { name: 'Black', value: 'oklch(0.30 0.00 0)' },
] as const;

export interface Entry {
  id?: number;
  name: string;
  message: string;
  created_at: string;
  signature?: string;
  image?: string;
  note_color?: string;
  pin_color?: string;
  approved?: boolean;
}

export const PLACEHOLDER_ENTRIES: Entry[] = [
  { name: 'Alex', message: 'Cool site! Love the folder design.', created_at: '2026-02-28', note_color: NOTE_COLORS[2].value, pin_color: PIN_COLORS[1].value },
  { name: 'Jordan', message: 'Found you through Launch Club. Keep building!', created_at: '2026-02-25', note_color: NOTE_COLORS[0].value, pin_color: PIN_COLORS[3].value },
  { name: 'Sam', message: 'Clean design. Astro is the way.', created_at: '2026-02-20', note_color: NOTE_COLORS[3].value, pin_color: PIN_COLORS[2].value },
  { name: 'Taylor', message: 'The pharmacy analyzer sounds interesting.', created_at: '2026-02-15', note_color: NOTE_COLORS[4].value, pin_color: PIN_COLORS[4].value },
  { name: 'Riley', message: 'Go Boilers!', created_at: '2026-02-10', note_color: NOTE_COLORS[1].value, pin_color: PIN_COLORS[0].value },
];
