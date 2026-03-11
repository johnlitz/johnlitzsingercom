import { useState, useCallback, useRef } from 'react';

interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  links: { label: string; url: string }[];
}

interface Props {
  projects: Project[];
}

export default function ProjectCarousel({ projects }: Props) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const enterDir = useRef<'left' | 'right'>('left');

  const goTo = useCallback(
    (index: number, dir: 'left' | 'right') => {
      if (isAnimating) return;
      enterDir.current = dir;
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 320);
    },
    [isAnimating],
  );

  const prev = () => {
    const i = current === 0 ? projects.length - 1 : current - 1;
    goTo(i, 'right');
  };

  const next = () => {
    const i = current === projects.length - 1 ? 0 : current + 1;
    goTo(i, 'left');
  };

  const prevIndex = current === 0 ? projects.length - 1 : current - 1;
  const nextIndex = current === projects.length - 1 ? 0 : current + 1;

  const p = projects[current];

  return (
    <div className="carousel-wrapper">
      {/* Title + description above carousel */}
      <div className="carousel-info">
        <h3 className="carousel-title">{p.title}</h3>
        <p className="carousel-desc">{p.description}</p>
      </div>

      <div className="carousel-track">
        {/* Left arrow */}
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={prev}
          aria-label="Previous project"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Cards container */}
        <div className="carousel-cards">
          {/* Left peek card */}
          <div className="carousel-card carousel-card-peek carousel-card-left" onClick={prev}>
            <div
              className="card-visual"
              style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--work-500) 12%, transparent), color-mix(in srgb, var(--work-500) 4%, transparent))` }}
            >
              <span className="card-visual-title">{projects[prevIndex].title}</span>
            </div>
          </div>

          {/* Center active card */}
          <a
            key={current}
            href={`/work/${p.slug}`}
            className={`carousel-card carousel-card-active ${enterDir.current === 'left' ? 'enter-from-right' : 'enter-from-left'}`}
          >
            <div
              className="card-visual"
              style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--work-500) 15%, transparent), color-mix(in srgb, var(--work-500) 5%, transparent))` }}
            >
              <svg viewBox="0 0 48 56" width="48" height="56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 0h28l16 16v36a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4Z" fill="var(--work-500)" opacity="0.3" />
                <path d="M32 0l16 16H36a4 4 0 0 1-4-4V0Z" fill="var(--work-500)" opacity="0.5" />
              </svg>
            </div>
          </a>

          {/* Right peek card */}
          <div className="carousel-card carousel-card-peek carousel-card-right" onClick={next}>
            <div
              className="card-visual"
              style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--work-500) 12%, transparent), color-mix(in srgb, var(--work-500) 4%, transparent))` }}
            >
              <span className="card-visual-title">{projects[nextIndex].title}</span>
            </div>
          </div>
        </div>

        {/* Right arrow */}
        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={next}
          aria-label="Next project"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Tech pills + dots below carousel */}
      <div className="carousel-tech">
        {p.tech.map((t) => (
          <span key={t} className="tech-pill">{t}</span>
        ))}
      </div>

      <div className="carousel-dots">
        {projects.map((_, i) => (
          <button
            key={i}
            className={`carousel-dot ${i === current ? 'active' : ''}`}
            onClick={() => {
              if (i < current) goTo(i, 'right');
              else if (i > current) goTo(i, 'left');
            }}
            aria-label={`Go to project ${i + 1}`}
            type="button"
          />
        ))}
      </div>

      <style>{`
        .carousel-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-md);
          width: 100%;
        }

        .carousel-track {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          width: 100%;
          max-width: 720px;
        }

        .carousel-arrow {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--background);
          color: var(--muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: color var(--duration-fast) ease,
                      border-color var(--duration-fast) ease,
                      box-shadow var(--duration-fast) ease;
          z-index: 2;
        }

        .carousel-arrow:hover {
          color: var(--work-500);
          border-color: var(--work-500);
          box-shadow: 0 2px 8px color-mix(in srgb, var(--work-500) 20%, transparent);
        }

        .carousel-arrow:focus-visible {
          outline: 2px solid var(--work-500);
          outline-offset: 2px;
        }

        .carousel-cards {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          overflow: hidden;
          position: relative;
        }

        .carousel-card {
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          text-decoration: none;
          color: inherit;
        }

        .carousel-card-active {
          width: 60%;
          margin: 0 auto;
          box-shadow: var(--shadow-md);
          will-change: transform, opacity;
        }

        .carousel-card-active .card-visual {
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .enter-from-right {
          animation: enterFromRight 300ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .enter-from-left {
          animation: enterFromLeft 300ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes enterFromRight {
          from { opacity: 0; transform: translateX(24px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }

        @keyframes enterFromLeft {
          from { opacity: 0; transform: translateX(-24px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }

        .carousel-card-peek {
          width: 20%;
          opacity: 0.5;
          cursor: pointer;
          transition: opacity var(--duration-base) ease;
        }

        .carousel-card-peek:hover {
          opacity: 0.75;
        }

        .carousel-card-peek .card-visual {
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .card-visual-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted);
          text-align: center;
          padding: 0 var(--space-sm);
        }


        .carousel-info {
          text-align: center;
          max-width: 420px;
        }

        .carousel-title {
          font-size: var(--text-lg);
          font-weight: 600;
          color: var(--foreground);
          margin-bottom: var(--space-xs);
        }

        .carousel-desc {
          font-size: var(--text-sm);
          color: var(--secondary);
          line-height: 1.4;
          margin-bottom: var(--space-sm);
        }

        .carousel-tech {
          display: flex;
          justify-content: center;
          gap: var(--space-xs);
          flex-wrap: wrap;
        }

        .tech-pill {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--work-500);
          background: color-mix(in srgb, var(--work-500) 8%, transparent);
          padding: 2px var(--space-sm);
          border-radius: 4px;
        }

        .carousel-dots {
          display: flex;
          gap: var(--space-sm);
        }

        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: oklch(0.10 0.00 0 / 0.15);
          cursor: pointer;
          transition: background var(--duration-base) ease,
                      transform var(--duration-base) ease;
          padding: 0;
        }

        .carousel-dot.active {
          background: var(--work-500);
          transform: scale(1.25);
        }

        .carousel-dot:hover:not(.active) {
          background: oklch(0.10 0.00 0 / 0.30);
        }

        .carousel-dot:focus-visible {
          outline: 2px solid var(--work-500);
          outline-offset: 2px;
        }

        @media (prefers-reduced-motion: reduce) {
          .carousel-arrow,
          .carousel-dot,
          .carousel-card-peek {
            transition: none;
          }
          .enter-from-right,
          .enter-from-left {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
