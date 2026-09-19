import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight, Eye } from 'lucide-react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  beforeLabel?: string;
  afterImage: string;
  afterLabel?: string;
  altText?: string;
  className?: string;
  aspectRatio?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  beforeLabel = 'Before: Raw Shell / Workshop',
  afterImage,
  afterLabel = 'After: Completed Commission',
  altText = 'Completed bespoke furniture commission before and after comparison',
  className = '',
  aspectRatio = 'aspect-[16/10]',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(clampedPercentage);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleInteractionEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleInteractionEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleInteractionEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleInteractionEnd]);

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  };

  return (
    <div className={`relative select-none flex flex-col ${className}`}>
      {/* Visual Slider Stage */}
      <div
        ref={containerRef}
        onClick={handleContainerClick}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        className={`relative w-full ${aspectRatio} overflow-hidden rounded-sm cursor-ew-resize group shadow-xl bg-stone-900 border border-[#C5A880]/30`}
        aria-label="Drag or click to compare before and after photos"
      >
        {/* Layer 1: "After" image (Base layer) */}
        <img
          src={afterImage}
          alt={`After: ${altText}`}
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          loading="lazy"
          decoding="async"
        />

        {/* Layer 2: "Before" image (Clipped with inset / polygon) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{
            clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          }}
        >
          <img
            src={beforeImage}
            alt={`Before: ${altText}`}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none filter brightness-95"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Floating Label: Before (Left) */}
        <div
          className={`absolute top-4 left-4 z-20 transition-opacity duration-300 pointer-events-none ${
            sliderPosition < 15 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-black/70 backdrop-blur-md text-stone-200 border border-stone-600/60 rounded-sm shadow-md">
            {beforeLabel}
          </span>
        </div>

        {/* Floating Label: After (Right) */}
        <div
          className={`absolute top-4 right-4 z-20 transition-opacity duration-300 pointer-events-none ${
            sliderPosition > 85 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase bg-[#132629]/80 backdrop-blur-md text-[#FAF8F5] border border-[#C5A880]/50 rounded-sm shadow-md">
            {afterLabel}
          </span>
        </div>

        {/* Vertical Divider Line with Gold Handle */}
        <div
          className="absolute top-0 bottom-0 z-30 pointer-events-none flex items-center justify-center"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Vertical Glowing Gold Line */}
          <div className="w-[2px] h-full bg-gradient-to-b from-[#C5A880]/40 via-[#C5A880] to-[#C5A880]/40 shadow-[0_0_12px_rgba(197,168,128,0.9)]" />

          {/* Central Handle Knob */}
          <div
            className={`absolute w-10 h-10 rounded-full bg-[#132629] border-2 border-[#C5A880] shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform duration-150 ${
              isDragging ? 'scale-110 ring-4 ring-[#C5A880]/30' : 'group-hover:scale-105'
            }`}
          >
            <ChevronsLeftRight className="w-5 h-5 text-[#C5A880]" />
          </div>
        </div>

        {/* Subtle Bottom Instruction Pill */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] uppercase tracking-widest text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-[#C5A880]" />
            Slide or tap to compare
          </span>
        </div>
      </div>

      {/* Quick Compare Buttons for accessibility & quick toggles */}
      <div className="flex items-center justify-between mt-3 text-xs">
        <button
          type="button"
          onClick={() => setSliderPosition(0)}
          className={`px-3 py-1.5 rounded-sm border transition-colors ${
            sliderPosition === 0
              ? 'bg-[#132629] text-[#FAF8F5] border-[#C5A880]'
              : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-[#C5A880]'
          }`}
        >
          Show Before (100%)
        </button>

        <button
          type="button"
          onClick={() => setSliderPosition(50)}
          className={`px-3 py-1.5 rounded-sm border transition-colors font-medium ${
            sliderPosition === 50
              ? 'bg-[#C5A880] text-[#132629] border-[#C5A880]'
              : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-[#C5A880]'
          }`}
        >
          Split 50 / 50
        </button>

        <button
          type="button"
          onClick={() => setSliderPosition(100)}
          className={`px-3 py-1.5 rounded-sm border transition-colors ${
            sliderPosition === 100
              ? 'bg-[#132629] text-[#FAF8F5] border-[#C5A880]'
              : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-[#C5A880]'
          }`}
        >
          Show After (100%)
        </button>
      </div>
    </div>
  );
};
