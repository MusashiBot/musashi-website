"use client";

import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

type SmoothScrollLinkProps = {
  targetId: string;
  className?: string;
  children: ReactNode;
  durationMs?: number;
  offset?: number;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export default function SmoothScrollLink({
  targetId,
  className,
  children,
  durationMs,
  offset = 0,
  onClick,
}: SmoothScrollLinkProps) {
  const animationFrameRef = useRef<number | null>(null);
  const previousScrollBehaviorRef = useRef<string | null>(null);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    event.preventDefault();

    const target = document.getElementById(targetId);
    if (!target) return;

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
      if (previousScrollBehaviorRef.current !== null) {
        document.documentElement.style.scrollBehavior = previousScrollBehaviorRef.current;
        previousScrollBehaviorRef.current = null;
      }
    }

    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = Math.max(
      0,
      Math.min(target.getBoundingClientRect().top + window.scrollY + offset, maxScrollY),
    );
    const startY = window.scrollY;
    const distance = targetY - startY;
    const absDistance = Math.abs(distance);

    if (absDistance < 4) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, targetY);
      return;
    }

    // Avoid interference from global CSS smooth behavior during manual animation.
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    previousScrollBehaviorRef.current = previousScrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";

    const resolvedDuration =
      durationMs ?? Math.max(320, Math.min(560, absDistance * 0.5));

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / resolvedDuration, 1);
      const eased = easeOutCubic(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        animationFrameRef.current = null;
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
        previousScrollBehaviorRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  };

  return (
    <a href={`#${targetId}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
