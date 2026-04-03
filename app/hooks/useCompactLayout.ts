'use client';

import { useEffect, useState } from 'react';

const COMPACT_LAYOUT_MAX_WIDTH = 1180;

function detectCompactLayout() {
  if (typeof window === 'undefined') return false;

  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const touchPoints = navigator.maxTouchPoints > 0;
  const smallViewport = window.innerWidth <= COMPACT_LAYOUT_MAX_WIDTH;
  const smallScreen = window.screen.width <= COMPACT_LAYOUT_MAX_WIDTH;

  return (coarsePointer || touchPoints) && (smallViewport || smallScreen);
}

export default function useCompactLayout() {
  const [isCompactLayout, setIsCompactLayout] = useState(false);

  useEffect(() => {
    const updateLayout = () => {
      setIsCompactLayout(detectCompactLayout());
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    window.addEventListener('orientationchange', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('orientationchange', updateLayout);
    };
  }, []);

  return isCompactLayout;
}
