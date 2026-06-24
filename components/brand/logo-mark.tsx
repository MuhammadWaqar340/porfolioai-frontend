import Image from "next/image";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/brand_logo.png";

interface LogoMarkProps {
  className?: string;
  priority?: boolean;
}

export function LogoMark({ className, priority = false }: LogoMarkProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl logo-mark-bg p-1 ring-1 ring-white/20",
        className
      )}
    >
      <Image
        src={LOGO_SRC}
        alt="PortfolioAI logo"
        fill
        priority={priority}
        className="object-contain mix-blend-lighten"
        sizes="(max-width: 768px) 36px, 40px"
      />
    </div>
  );
}
