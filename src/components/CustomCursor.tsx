import React, { useEffect, useRef, useState } from 'react';

/**
 * Bespoke luxury custom cursor with fluid magnetic trailing physics,
 * tactile click response, and interactive target magnification.
 * Automatically disabled on touch screens and respects reduced motion.
 */
export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  // Position references for 60/120fps lerp loop
  const mousePos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    // Strictly mount custom cursor on devices with fine pointer (mouse/trackpad)
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(pointer: fine)');
    if (!mediaQuery.matches) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      // Avoid off-screen fly-in artifact from (-100, -100) on initial movement
      if (!hasMovedRef.current) {
        outerPos.current.x = e.clientX;
        outerPos.current.y = e.clientY;
        hasMovedRef.current = true;
      }

      setIsVisible(true);

      // Instantly position inner precision dot with zero latency
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check for interactive targets under pointer
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInput = !!target.closest('input[type="text"], input[type="email"], input[type="tel"], input[type="search"], textarea');
        setIsTextInput(isInput);

        const interactiveEl = target.closest(
          'a, button, input, textarea, select, [role="button"], label, .interactive, [data-cursor-interactive="true"], summary'
        );
        const viewEl = target.closest('[data-cursor-label]');

        setIsHovered(!!interactiveEl);

        if (viewEl) {
          const label = viewEl.getAttribute('data-cursor-label');
          setHoverLabel(label || null);
        } else {
          setHoverLabel(null);
        }
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    // Smooth trailing follower animation loop (LERP) without CSS transition conflict
    const lerpSpeed = prefersReducedMotion ? 0.35 : 0.18;
    const animate = () => {
      const dx = mousePos.current.x - outerPos.current.x;
      const dy = mousePos.current.y - outerPos.current.y;

      outerPos.current.x += dx * lerpSpeed;
      outerPos.current.y += dy * lerpSpeed;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${outerPos.current.x}px, ${outerPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, []); // Static mount: ensures event listeners are never thrashed on mouse move

  // Touch screen fallback
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
    return null;
  }

  return (
    <div
      id="bespoke-custom-cursor-root"
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[99999] transition-opacity duration-300 ${
        isVisible && !isTextInput ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Outer trailing aura ring - positioned purely by RAF LERP; scaling handled on inner div */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 pointer-events-none flex items-center justify-center will-change-transform"
      >
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-150 ease-out ${
            isHovered
              ? 'w-12 h-12 border border-[#C5A880] bg-[#C5A880]/15 dark:bg-[#C5A880]/20 shadow-[0_0_20px_rgba(197,168,128,0.35)]'
              : 'w-7 h-7 border border-[#C5A880]/80 dark:border-[#C5A880]/90 bg-transparent shadow-[0_0_10px_rgba(197,168,128,0.15)]'
          } ${isClicked ? 'scale-75 opacity-90' : 'scale-100 opacity-100'}`}
        >
          {hoverLabel && (
            <span className="text-[9px] uppercase tracking-widest font-semibold text-[#132629] dark:text-[#FAF8F5] bg-[#C5A880]/90 px-1.5 py-0.5 rounded shadow-sm">
              {hoverLabel}
            </span>
          )}
        </div>
      </div>

      {/* Inner precision gold point dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
      >
        <div
          className={`rounded-full bg-[#C5A880] shadow-[0_0_8px_rgba(197,168,128,0.9)] transition-all duration-100 ease-out ${
            isHovered ? 'w-2 h-2 scale-125' : 'w-1.5 h-1.5 scale-100'
          } ${isClicked ? 'scale-50' : ''}`}
        />
      </div>
    </div>
  );
};

