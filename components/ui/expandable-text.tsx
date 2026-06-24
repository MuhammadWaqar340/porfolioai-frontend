"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  className?: string;
  wrapperClassName?: string;
  lines?: 2 | 3 | 4;
}

const clampByLines = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
} as const;

export function ExpandableText({
  text,
  className,
  wrapperClassName,
  lines = 2,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);
  const trimmed = text.trim();

  useLayoutEffect(() => {
    if (!trimmed || expanded) return;

    const el = textRef.current;
    if (!el) return;

    const checkClamped = () => {
      setIsClamped(el.scrollHeight > el.clientHeight + 1);
    };

    checkClamped();
    const observer = new ResizeObserver(checkClamped);
    observer.observe(el);
    return () => observer.disconnect();
  }, [trimmed, expanded, lines]);

  if (!trimmed) {
    return null;
  }

  const showToggle = isClamped || expanded;

  return (
    <div className={wrapperClassName}>
      <p
        ref={textRef}
        className={cn(className, !expanded && clampByLines[lines])}
      >
        {trimmed}
      </p>
      {showToggle ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-1 rounded-sm text-xs font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={expanded}
        >
          {expanded ? "See less" : "See more"}
        </button>
      ) : null}
    </div>
  );
}
