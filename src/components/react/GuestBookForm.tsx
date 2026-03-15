import { useState, useRef, useEffect } from 'react';
import { type Entry } from './guestbook/types';
import { isConfigured, fetchEntries, submitEntry } from './guestbook/data';

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
    ctx.strokeStyle = '#1a1a1a';
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

export default function GuestBookForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const honeypotRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEntries().then((data) => {
      setEntries(data);
      setLoading(false);
    });
  }, []);

  const previewEntries = entries.slice(0, 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypotRef.current?.value) return;
    if (!name.trim() || !message.trim()) return;
    if (!isConfigured) return;

    setSubmitting(true);
    setError('');

    const ok = await submitEntry({
      name: name.trim(),
      message: message.trim(),
      signature: signature || '',
      image: '',
      note_color: '',
      pin_color: '',
    });

    if (ok) {
      setSubmitted(true);
      setName('');
      setMessage('');
      setSignature('');
    } else {
      setError('Failed to sign. Try again.');
    }

    setSubmitting(false);
  };

  return (
    <div className="gb-layout">
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
            required
            disabled={!isConfigured || submitting}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message..."
            maxLength={500}
            rows={2}
            className="gb-textarea"
            required
            disabled={!isConfigured || submitting}
          />

          <SignatureCanvas onSignatureChange={setSignature} />

          <button type="submit" disabled={!isConfigured || submitting} className="gb-submit">
            {submitting ? 'Signing...' : 'Sign'}
          </button>
          {error && <p className="gb-error">{error}</p>}
          {submitted && <p className="gb-success">Signed! Your entry will appear after approval.</p>}
          {!isConfigured && <p className="gb-note">Coming soon</p>}
        </form>
      </div>

      {/* Recent entries preview */}
      {!loading && previewEntries.length > 0 && (
        <div className="gb-preview">
          <ul className="gb-preview-list">
            {previewEntries.map((entry, i) => (
              <li key={entry.id ?? i} className="gb-preview-item">
                <p className="gb-preview-message">{entry.message}</p>
                <span className="gb-preview-author">&mdash; {entry.name}</span>
              </li>
            ))}
          </ul>
          {entries.length > 3 && (
            <a href="/guest-book/entries" className="gb-see-more">
              See all entries
            </a>
          )}
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
          min-height: 80px;
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

        .gb-error {
          font-size: 0.75rem;
          color: var(--accent);
        }

        .gb-success {
          font-size: 0.75rem;
          color: var(--work-500);
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
          border: 1px dashed var(--border-subtle);
          border-radius: 6px;
          background: var(--background);
          cursor: crosshair;
          touch-action: none;
          width: 100%;
          height: 100px;
        }

        /* Recent entries preview */
        .gb-preview {
          width: 100%;
          max-width: 540px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
        }

        .gb-preview-list {
          list-style: none;
          width: 100%;
          padding: 0;
          margin: 0;
        }

        .gb-preview-item {
          padding: var(--space-sm) 0;
          border-bottom: 1px solid var(--border-subtle);
        }

        .gb-preview-message {
          font-size: var(--text-sm);
          color: var(--foreground);
          line-height: 1.5;
          margin-bottom: 2px;
        }

        .gb-preview-author {
          font-size: var(--text-xs);
          color: var(--muted);
        }

        .gb-see-more {
          font-family: var(--font-mono);
          font-size: var(--text-xs);
          color: var(--guestbook-500);
          text-decoration: none;
          transition: opacity var(--duration-fast) ease;
        }

        .gb-see-more:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .gb-submit {
            width: 100%;
            align-self: stretch;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gb-input,
          .gb-textarea {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
