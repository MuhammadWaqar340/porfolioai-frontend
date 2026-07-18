"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { landingEase } from "@/lib/landing-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  /** Stagger delay between letters in seconds. */
  stagger?: number;
  as?: "h1" | "h2" | "span" | "p";
}

/**
 * Letter-by-letter reveal with blur + rise. Used for hero headlines.
 */
export function TextReveal({
  text,
  className,
  stagger = 0.028,
  as = "h1",
}: TextRevealProps) {
  const reducedMotion = useReducedMotion();
  const Tag = motion[as];

  if (reducedMotion) {
    const Static = as;
    return <Static className={className}>{text}</Static>;
  }

  const words = text.split(" ");

  return (
    <Tag className={cn("flex flex-wrap", className)} aria-label={text}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="mr-[0.28em] inline-flex overflow-hidden">
          {word.split("").map((char, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              className="inline-block"
              initial={{ opacity: 0, y: "0.55em", filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.55,
                ease: landingEase,
                delay: 0.12 + (wi * 4 + ci) * stagger,
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
