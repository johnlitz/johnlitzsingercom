import { useState, useRef, useCallback } from 'react';

const NOTE_COLORS = [
  { name: 'Lemon', value: 'oklch(0.93 0.04 95)' },
  { name: 'Blush', value: 'oklch(0.93 0.04 15)' },
  { name: 'Sky', value: 'oklch(0.93 0.04 240)' },
  { name: 'Mint', value: 'oklch(0.93 0.04 160)' },
  { name: 'Lavender', value: 'oklch(0.93 0.04 300)' },
  { name: 'Peach', value: 'oklch(0.93 0.04 55)' },
] as const;

const PIN_COLORS = [
  { name: 'Red', value: 'oklch(0.65 0.20 25)' },
  { name: 'Blue', value: 'oklch(0.65 0.17 264)' },
  { name: 'Green', value: 'oklch(0.65 0.17 152)' },
  { name: 'Gold', value: 'oklch(0.65 0.17 80)' },
  { name: 'Purple', value: 'oklch(0.65 0.17 295)' },
  { name: 'Black', value: 'oklch(0.30 0.00 0)' },
] as const;

interface Entry {
  name: string;
  message: string;
  date: string;
  signature?: string;
  image?: string;
  noteColor?: string;
  pinColor?: string;
}

const PLACEHOLDER_ENTRIES: Entry[] = [
  { name: 'Alex', message: 'Cool site! Love the folder design.', date: '2026-02-28', noteColor: NOTE_COLORS[2].value, pinColor: PIN_COLORS[1].value },
  { name: 'Jordan', message: 'Found you through Launch Club. Keep building!', date: '2026-02-25', noteColor: NOTE_COLORS[0].value, pinColor: PIN_COLORS[3].value },
  { name: 'Sam', message: 'Clean design. Astro is the way.', date: '2026-02-20', noteColor: NOTE_COLORS[3].value, pinColor: PIN_COLORS[2].value },
  { name: 'Taylor', message: 'The pharmacy analyzer sounds interesting.', date: '2026-02-15', noteColor: NOTE_COLORS[4].value, pinColor: PIN_COLORS[4].value },
  { name: 'Riley', message: 'Go Boilers!', date: '2026-02-10', noteColor: NOTE_COLORS[1].value, pinColor: PIN_COLORS[0].value },
];

const MAX_IMAGE_WIDTH = 400;
const MAX_IMAGE_SIZE_KB = 200;

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > MAX_IMAGE_WIDTH) {
          height = (height * MAX_IMAGE_WIDTH) / width;
          width = MAX_IMAGE_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let result = canvas.toDataURL('image/jpeg', quality);

        while (result.length > MAX_IMAGE_SIZE_KB * 1024 * 1.37 && quality > 0.2) {
          quality -= 0.1;
          result = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(result);
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Thumbtack({ color }: { color: string }) {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" className="note-pin" aria-hidden="true">
      <circle cx="8" cy="6" r="5" fill={color} />
      <rect x="7" y="10" width="2" height="9" rx="1" fill="oklch(0.45 0.02 80)" />
      <circle cx="8" cy="6" r="2.5" fill="oklch(0.85 0.02 80)" opacity="0.5" />
    </svg>
  );
}

function ColorChooser({
  label,
  colors,
  selected,
  onSelect,
}: {
  label: string;
  colors: readonly { name: string; value: string }[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="color-chooser">
      <span className="color-chooser-label">{label}</span>
      <div className="color-chooser-row">
        {colors.map((c, i) => (
          <button
            key={c.name}
            type="button"
            className={`color-swatch ${i === selected ? 'color-swatch-selected' : ''}`}
            style={{ '--swatch-color': c.value } as React.CSSProperties}
            onClick={() => onSelect(i)}
            aria-label={c.name}
            title={c.name}
          />
        ))}
      </div>
    </div>
  );
}

function SignatureCanvas({ onSignatureChange }: { onSignatureChange: (data: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = canvasRef.current!.getContext('2d')!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext('2d')!;
    const pos = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1a1a1a'; /* matches --foreground; Canvas 2D API can't use CSS vars */
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    drawing.current = false;
    const data = canvasRef.current!.toDataURL('image/png');
    onSignatureChange(data);
  };

  const clear = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSignatureChange('');
  };

  return (
    <div className="sig-wrapper">
      <div className="sig-label">
        <span>Sign here</span>
        <button type="button" className="sig-clear" onClick={clear}>Clear</button>
      </div>
      <canvas
        ref={canvasRef}
        width={540}
        height={100}
        className="sig-canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
    </div>
  );
}

export default function GuestBookPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [entries] = useState<Entry[]>(PLACEHOLDER_ENTRIES);
  const [noteColorIdx, setNoteColorIdx] = useState(0);
  const [pinColorIdx, setPinColorIdx] = useState(0);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const previewEntries = entries.slice(0, 3);

  const handleImageChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;

    try {
      const compressed = await compressImage(file);
      setImagePreview(compressed);
    } catch {
      // silently fail
    }
  }, []);

  const removeImage = useCallback(() => {
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypotRef.current?.value) return;
    // Supabase integration -- coming soon
  };

  return (
    <div className="gb-layout">
      {/* Top: Form */}
      <div className="gb-form-section">
        <form onSubmit={handleSubmit} className="gb-form">
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={100}
            className="gb-input"
            disabled
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message..."
            maxLength={500}
            rows={2}
            className="gb-textarea"
            disabled
          />

          <SignatureCanvas onSignatureChange={setSignature} />

          <div className="color-choosers">
            <ColorChooser
              label="Note"
              colors={NOTE_COLORS}
              selected={noteColorIdx}
              onSelect={setNoteColorIdx}
            />
            <ColorChooser
              label="Pin"
              colors={PIN_COLORS}
              selected={pinColorIdx}
              onSelect={setPinColorIdx}
            />
          </div>

          <div className="gb-form-bottom">
            <div className="gb-image-upload">
              <label className="gb-image-label">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="gb-file-input"
                  disabled
                />
                <span className="gb-image-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  Photo
                </span>
              </label>
              {imagePreview && (
                <div className="gb-image-preview">
                  <img src={imagePreview} alt="Upload preview" />
                  <button type="button" className="gb-image-remove" onClick={removeImage}>
                    &times;
                  </button>
                </div>
              )}
            </div>
            <button type="submit" disabled className="gb-submit">
              Sign
            </button>
          </div>
          <p className="gb-note">Coming soon</p>
        </form>
      </div>

      {/* Preview: Sticky note entries */}
      <div className="gb-entries-section">
        <div className="gb-notes-board">
          {previewEntries.map((entry, i) => {
            const hash = entry.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
            const rotation = ((hash % 7) - 3);
            const noteColor = entry.noteColor || NOTE_COLORS[hash % NOTE_COLORS.length].value;
            const pinColor = entry.pinColor || PIN_COLORS[hash % PIN_COLORS.length].value;

            return (
              <div
                key={i}
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
        {entries.length > 3 && (
          <button
            type="button"
            className="gb-see-more"
            onClick={() => document.getElementById('gb-all-entries')?.scrollIntoView({ behavior: 'smooth' })}
          >
            See all entries
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        )}
      </div>

      {/* All entries — scrollable section below viewport */}
      {entries.length > 0 && (
        <div id="gb-all-entries" className="gb-all-section">
          <h2 className="gb-all-title">All Entries</h2>
          <div className="gb-all-grid">
            {entries.map((entry, i) => {
              const hash = entry.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
              const rotation = ((hash % 7) - 3) * 0.5;
              const noteColor = entry.noteColor || NOTE_COLORS[hash % NOTE_COLORS.length].value;
              const pinColor = entry.pinColor || PIN_COLORS[hash % PIN_COLORS.length].value;

              return (
                <div
                  key={i}
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
        </div>
      )}

      <style>{`
        .gb-layout {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          width: 100%;
          flex: 1;
          min-height: 0;
        }

        .gb-form-section {
          width: 100%;
          max-width: 540px;
        }

        .gb-entries-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          flex: 1;
          min-height: 0;
        }

        .gb-form-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-sm);
        }

        .gb-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
          position: relative;
        }

        .gb-input,
        .gb-textarea {
          font-family: var(--font);
          font-size: var(--text-sm);
          color: var(--foreground);
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: var(--space-sm) var(--space-3);
          outline: none;
          width: 100%;
          min-height: 44px;
          transition: border-color var(--duration-fast) ease;
        }

        .gb-input:focus-visible,
        .gb-textarea:focus-visible {
          border-color: var(--guestbook-500);
          outline: 2px solid color-mix(in srgb, var(--guestbook-500) 45%, transparent);
          outline-offset: -1px;
        }

        .gb-input:disabled,
        .gb-textarea:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gb-textarea {
          resize: none;
          min-height: 100px;
        }

        /* Image upload */
        .gb-image-upload {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .gb-file-input {
          display: none;
        }

        .gb-image-label {
          cursor: pointer;
        }

        .gb-image-label:has(.gb-file-input:disabled) {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gb-image-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-xs);
          font-family: var(--font);
          font-size: 0.75rem;
          color: var(--muted);
          padding: var(--space-xs) var(--space-sm);
          border: 1px dashed oklch(0.10 0.00 0 / 0.15);
          border-radius: 6px;
          transition: color var(--duration-fast) ease,
                      border-color var(--duration-fast) ease;
        }

        .gb-image-label:not(:has(.gb-file-input:disabled)):hover .gb-image-btn {
          color: var(--guestbook-500);
          border-color: var(--guestbook-500);
        }

        .gb-image-preview {
          position: relative;
          display: inline-block;
          max-width: 120px;
        }

        .gb-image-preview img {
          width: 100%;
          height: auto;
          border-radius: 6px;
          display: block;
        }

        .gb-image-remove {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--foreground);
          color: var(--background);
          border: none;
          font-size: 14px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gb-submit {
          font-family: var(--font);
          font-weight: 600;
          font-size: var(--text-xs);
          color: var(--background);
          background: var(--guestbook-500);
          border: none;
          padding: var(--space-xs) var(--space-6);
          border-radius: 8px;
          cursor: pointer;
          align-self: flex-start;
          min-height: 44px;
        }

        .gb-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .gb-note {
          font-size: 0.75rem;
          color: var(--muted);
          font-style: italic;
        }

        /* Signature */
        .sig-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-xs);
        }

        .sig-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: var(--muted);
        }

        .sig-clear {
          font-size: 0.6875rem;
          color: var(--muted);
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
        }

        .sig-canvas {
          border: 1px dashed oklch(0.10 0.00 0 / 0.15);
          border-radius: 6px;
          background: var(--background);
          cursor: crosshair;
          touch-action: none;
          width: 100%;
          height: 100px;
        }

        /* Color chooser */
        .color-choosers {
          display: flex;
          gap: var(--space-6);
        }

        .color-chooser {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .color-chooser-label {
          font-size: 0.75rem;
          color: var(--muted);
        }

        .color-chooser-row {
          display: flex;
          gap: var(--space-xs);
        }

        .color-swatch {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid transparent;
          background: var(--swatch-color);
          cursor: pointer;
          transition: transform var(--duration-fast) ease,
                      border-color var(--duration-fast) ease;
          padding: 0;
        }

        .color-swatch:hover {
          transform: scale(1.15);
        }

        .color-swatch-selected {
          border-color: oklch(0.40 0.00 0);
          transform: scale(1.1);
        }

        /* Notes board */
        .gb-notes-board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-lg);
          justify-content: center;
          width: 100%;
          max-width: 720px;
          padding: var(--space-sm);
        }

        .sticky-note {
          position: relative;
          background: var(--note-bg, oklch(0.93 0.04 95));
          border-radius: 2px;
          padding: var(--space-lg) var(--space-md) var(--space-md);
          transform: rotate(var(--note-rotation, 0deg));
          box-shadow:
            0 1px 3px oklch(0.50 0.00 0 / 0.06),
            0 4px 12px oklch(0.50 0.00 0 / 0.04);
          transition: transform var(--duration-base) cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow var(--duration-base) ease;
        }

        .sticky-note:hover {
          transform: rotate(var(--note-rotation, 0deg)) translateY(-4px) scale(1.02);
          box-shadow:
            0 4px 8px oklch(0.50 0.00 0 / 0.08),
            0 12px 32px oklch(0.50 0.00 0 / 0.06);
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

        /* See more */
        .gb-see-more {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          font-family: var(--font);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--guestbook-500);
          background: none;
          border: 1px solid color-mix(in srgb, var(--guestbook-500) 30%, transparent);
          border-radius: 8px;
          padding: var(--space-sm) var(--space-md);
          cursor: pointer;
          transition: background var(--duration-fast) ease,
                      border-color var(--duration-fast) ease;
        }

        .gb-see-more:hover {
          background: color-mix(in srgb, var(--guestbook-500) 8%, transparent);
          border-color: var(--guestbook-500);
        }

        /* All entries section */
        .gb-all-section {
          width: 100%;
          padding: 3rem 0 var(--space-lg);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-6);
        }

        .gb-all-title {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--guestbook-500);
          letter-spacing: -0.01em;
        }

        .gb-all-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-lg);
          width: 100%;
          max-width: 720px;
          padding: 0 var(--space-sm) var(--space-lg);
        }

        /* Pagination */
        .gb-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          padding-top: var(--space-xs);
        }

        .gb-page-arrow {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color var(--duration-fast) ease,
                      border-color var(--duration-fast) ease;
          padding: 0;
        }

        .gb-page-arrow:hover:not(:disabled) {
          color: var(--guestbook-500);
          border-color: var(--guestbook-500);
        }

        .gb-page-arrow:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .gb-page-num {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--muted);
        }

        @media (max-width: 600px) {
          .gb-notes-board {
            grid-template-columns: 1fr;
            max-width: 280px;
          }
          .gb-all-grid {
            grid-template-columns: 1fr;
            max-width: 280px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gb-page-arrow,
          .gb-input,
          .gb-textarea,
          .sticky-note,
          .color-swatch {
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
