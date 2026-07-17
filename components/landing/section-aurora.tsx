import { cn } from "@/lib/utils";

interface SectionAuroraProps {
  className?: string;
  /** Horizontal anchor for the primary glow. */
  align?: "left" | "center" | "right";
}

/**
 * Decorative ambient glow layer that ties the landing sections to the hero's
 * aurora aesthetic. Pure CSS (blurred gradient blobs, compositor-only) so it
 * adds no WebGL cost and is safe on every device. Non-interactive.
 */
export function SectionAurora({ className, align = "center" }: SectionAuroraProps) {
  const anchor =
    align === "left" ? "left-[-10%]" : align === "right" ? "right-[-10%]" : "left-1/2 -translate-x-1/2";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div
        className={cn(
          "section-glow absolute top-[-8%] h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.6_0.22_300/22%),transparent_70%)] blur-3xl sm:h-96 sm:w-96",
          anchor,
        )}
      />
      <div className="section-glow-slow absolute bottom-[-12%] right-[8%] h-72 w-72 rounded-full bg-[radial-gradient(circle,oklch(0.62_0.2_20/16%),transparent_70%)] blur-3xl sm:h-96 sm:w-96" />
    </div>
  );
}
