'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage from left
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    // Clamp between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(clampedPercentage);
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      handleMove(touch.clientX);
    };

    const handlePointerEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handlePointerEnd);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handlePointerEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handlePointerEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handlePointerEnd);
    };
  }, [handleMove, isDragging]);

  return (
    <div ref={containerRef} className="relative w-full max-w-[1100px] mx-auto h-[520px] border border-[var(--border-light)] rounded-xl overflow-hidden">
      {/* Without Musashi - Bottom Layer (Full Width) */}
      <div className="absolute inset-0 bg-black">
        <div className="p-5 pt-14 pb-4 bg-[var(--tweet-bg)] flex flex-col gap-3 h-full">
          {/* Pinned indicator */}
          <div className="flex items-center gap-[6px] pl-[50px] w-full">
            <svg className="w-3 h-3 fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
            </svg>
            <span className="font-inter text-[#71767B] text-[13px] font-bold">Pinned</span>
          </div>

          {/* Tweet Header */}
          <div className="flex items-start justify-between gap-[10px] w-full">
            <div className="flex items-start gap-[10px] flex-1">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="/images/generated-1771892787267.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <div className="flex items-center gap-1">
                  <span className="font-inter text-[var(--tweet-text)] text-[15px] font-bold">Elon Musk</span>
                  <svg className="w-4 h-4 fill-[#1D9BF0]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.52 3.59a.75.75 0 011.06 0l1.42 1.42 1.06-1.06c1.36-1.36 3.58-1.36 4.94 0l2.83 2.83c1.36 1.36 1.36 3.58 0 4.94l-1.06 1.06 1.42 1.42a.75.75 0 010 1.06l-8.66 8.66a.75.75 0 01-1.06 0l-1.42-1.42-1.06 1.06c-1.36 1.36-3.58 1.36-4.94 0L.36 19.73c-1.36-1.36-1.36-3.58 0-4.94l1.06-1.06L.0 12.31a.75.75 0 010-1.06L8.52 3.59zM12 6.94L6.94 12 12 17.06 17.06 12 12 6.94z"/>
                  </svg>
                  <span className="font-inter text-[#71767B] text-[15px] font-normal">@elonmusk</span>
                  <span className="font-inter text-[#71767B] text-[15px] font-normal">· 23h</span>
                </div>
              </div>
            </div>
            <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
            </svg>
          </div>

          {/* Tweet Body */}
          <p className="font-inter text-[var(--tweet-text)] text-[15px] leading-[1.5] w-full">
            Grok 4.20 is BASED.<br /><br />
            The only AI that doesn&apos;t equivocate when asked if America is on stolen land.<br /><br />
            The others are weak sauce.
          </p>

          {/* Tweet Actions */}
          <div className="flex items-center justify-between w-full pt-2">
            <div className="flex items-center gap-[6px]">
              <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/>
              </svg>
              <span className="font-inter text-[#71767B] text-xs font-normal">12.4K</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
              </svg>
              <span className="font-inter text-[#71767B] text-xs font-normal">8.2K</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
              </svg>
              <span className="font-inter text-[#71767B] text-xs font-normal">95K</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"/>
              </svg>
            </div>
            <div className="flex items-center gap-[6px]">
              <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/>
              </svg>
            </div>
          </div>

          {/* Missed Opportunity Banner */}
          <div className="flex flex-col items-center justify-center gap-3 py-12 px-5 bg-[var(--tweet-missed-bg)] border-t border-[var(--tweet-missed-border)] mt-auto">
            <svg className="w-10 h-10 fill-[var(--tweet-missed-icon)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 01-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8.5 5.5a7.029 7.029 0 002.79-.588zM5.21 3.088A7.028 7.028 0 018 2.5c5.5 0 8.5 5.5 8.5 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 00-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 002.829 2.829l-2.83-2.829zm4.95.708l-2.829-2.83a2.5 2.5 0 012.829 2.829zm3.171 6l-12-12 .708-.708 12 12-.708.708z"/>
            </svg>
            <div className="flex flex-col items-center gap-1">
              <span className="font-jetbrains text-[var(--tweet-missed-text)] text-[15px] font-bold leading-[1.6] text-center">
                You scrolled past a<br />tradeable market
              </span>
              <span className="font-jetbrains text-[var(--tweet-missed-sub)] text-[13px] font-normal text-center">
                98% NO at $350K volume
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* With Musashi - Top Layer (Clipped) */}
      <div
        className="absolute left-0 top-0 h-full bg-black overflow-hidden transition-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <div className="p-5 pt-14 pb-4 bg-[var(--tweet-bg)] flex flex-col gap-3 h-full" style={{ width: '1100px' }}>
          {/* Pinned indicator */}
          <div className="flex items-center gap-[6px] pl-[50px] w-full">
            <svg className="w-3 h-3 fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
            </svg>
            <span className="font-inter text-[#71767B] text-[13px] font-bold">Pinned</span>
          </div>

          {/* Tweet Header */}
          <div className="flex items-start justify-between gap-[10px] w-full">
            <div className="flex items-start gap-[10px] flex-1">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="/images/generated-1771892787267.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-[2px]">
                <div className="flex items-center gap-1">
                  <span className="font-inter text-[var(--tweet-text)] text-[15px] font-bold">Elon Musk</span>
                  <svg className="w-4 h-4 fill-[#1D9BF0]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.52 3.59a.75.75 0 011.06 0l1.42 1.42 1.06-1.06c1.36-1.36 3.58-1.36 4.94 0l2.83 2.83c1.36 1.36 1.36 3.58 0 4.94l-1.06 1.06 1.42 1.42a.75.75 0 010 1.06l-8.66 8.66a.75.75 0 01-1.06 0l-1.42-1.42-1.06 1.06c-1.36 1.36-3.58 1.36-4.94 0L.36 19.73c-1.36-1.36-1.36-3.58 0-4.94l1.06-1.06L.0 12.31a.75.75 0 010-1.06L8.52 3.59zM12 6.94L6.94 12 12 17.06 17.06 12 12 6.94z"/>
                  </svg>
                  <span className="font-inter text-[#71767B] text-[15px] font-normal">@elonmusk</span>
                  <span className="font-inter text-[#71767B] text-[15px] font-normal">· 23h</span>
                </div>
              </div>
            </div>
            <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
            </svg>
          </div>

          {/* Tweet Body */}
          <p className="font-inter text-[var(--tweet-text)] text-[15px] leading-[1.5] w-full">
            Grok 4.20 is BASED.<br /><br />
            The only AI that doesn&apos;t equivocate when asked if America is on stolen land.<br /><br />
            The others are weak sauce.
          </p>

          {/* Market Card - ONLY VISIBLE WITH MUSASHI */}
          <div className="flex flex-col gap-3 p-4 px-5 bg-[var(--tweet-card)] border border-[var(--tweet-border)] rounded-xl shadow-[0_0_12px_rgba(255,255,255,0.08)] w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="font-inter text-[#71767B] text-xs font-normal">Prediction Market</span>
                <span className="font-inter text-[#71767B] text-xs font-normal">·</span>
                <span className="font-inter text-[#71767B] text-xs font-normal">Polymarket</span>
              </div>
              <span className="font-jetbrains text-[#8B8B8B] text-[11px] font-bold">100% match</span>
            </div>
            <span className="font-inter text-[var(--tweet-text)] text-sm font-semibold leading-[1.4] w-full">
              Will xAI have the best AI model at the end of February 2026?
            </span>
            <div className="flex items-center gap-4 w-full">
              <div className="flex gap-2">
                <span className="font-inter text-[#71767B] text-xs font-bold">YES</span>
                <span className="font-inter text-[var(--tweet-text)] text-xl font-bold">2%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-inter text-[#71767B] text-xs font-bold">NO</span>
                <span className="font-inter text-[#FF4444] text-xl font-bold">98%</span>
                <svg className="w-[14px] h-[14px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
              <span className="font-inter text-[#71767B] text-[13px] font-semibold">-0.4%</span>
            </div>
            <div className="relative w-full h-1 bg-[#2F3336] rounded-sm overflow-hidden">
              <div className="absolute left-0 top-0 h-full w-[2%] bg-[#00CC66] rounded-sm" />
            </div>
            <div className="flex items-center gap-4">
              <span className="font-inter text-[#8B8B8B] text-xs font-normal">Resolves Feb 28</span>
              <span className="font-inter text-[#71767B] text-xs font-normal">$350K</span>
            </div>
          </div>

          {/* Tweet Actions */}
          <div className="flex items-center justify-between w-full pt-2">
            <div className="flex items-center gap-[6px]">
              <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/>
              </svg>
              <span className="font-inter text-[#71767B] text-xs font-normal">12.4K</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
              </svg>
              <span className="font-inter text-[#71767B] text-xs font-normal">8.2K</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
              </svg>
              <span className="font-inter text-[#71767B] text-xs font-normal">95K</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"/>
              </svg>
            </div>
            <div className="flex items-center gap-[6px]">
              <svg className="w-[18px] h-[18px] fill-[#71767B]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute left-6 top-5 px-[14px] py-[6px] bg-[var(--overlay-light)] border border-[var(--border-lighter)] rounded-md z-10 pointer-events-none">
        <span className="font-jetbrains text-[#FFFFFF60] text-[11px] font-bold tracking-[1px]">With Musashi</span>
      </div>
      <div className="absolute right-6 top-5 px-[14px] py-[6px] bg-[var(--overlay-light)] border border-[var(--border-lighter)] rounded-md z-10 pointer-events-none">
        <span className="font-jetbrains text-[#FFFFFF60] text-[11px] font-bold tracking-[1px]">Without Musashi</span>
      </div>

      {/* Divider Line - lighter, more transparent */}
      <div
        className="absolute top-0 w-[1px] h-full -translate-x-1/2 z-20 pointer-events-none"
        style={{ left: `${sliderPosition}%`, backgroundColor: 'rgba(255,255,255,0.22)' }}
      />

      {/* Slider Handle - smaller, semi-transparent so content shows through */}
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-30 select-none border border-white/40 bg-white/25 backdrop-blur-[2px]"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={() => setIsDragging(true)}
      >
        <svg className="w-3 h-3 fill-white drop-shadow-[0_0_1px_rgba(0,0,0,0.8)]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 13.5l-1.5 1.5L2 10l5-5 1.5 1.5L5.5 9.5h13l-3-3L17 5l5 5-5 5-1.5-1.5 3-3h-13l3 3z"/>
        </svg>
      </div>
    </div>
  );
}
