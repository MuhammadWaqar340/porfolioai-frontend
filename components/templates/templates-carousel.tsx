"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TemplatesCarouselProps {
  children: React.ReactNode;
  className?: string;
}

export function TemplatesCarousel({ children, className }: TemplatesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollState, children]);

  function scrollBy(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-template-slide]");
    const gap = 20;
    const amount = (card?.offsetWidth ?? 320) + gap;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-muted/30 to-transparent sm:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-muted/30 to-transparent sm:block"
        aria-hidden
      />

      <div className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 sm:left-6 sm:block lg:left-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border-border/60 bg-background/90 shadow-md backdrop-blur-sm"
          onClick={() => scrollBy("left")}
          disabled={!canScrollLeft}
          aria-label="Scroll templates left"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 sm:right-6 sm:block lg:right-8">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full border-border/60 bg-background/90 shadow-md backdrop-blur-sm"
          onClick={() => scrollBy("right")}
          disabled={!canScrollRight}
          aria-label="Scroll templates right"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className={cn(
          "flex gap-4 overflow-x-auto pb-2 pt-1",
          "scroll-smooth snap-x snap-mandatory",
          "scroll-pl-6 sm:scroll-pl-10 lg:scroll-pl-12",
          "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "pl-6 pr-4 sm:gap-5 sm:pl-10 sm:pr-6 lg:pl-12 lg:pr-8"
        )}
      >
        {children}
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground sm:hidden">
        Swipe to browse templates
      </p>
    </div>
  );
}

interface TemplateCarouselSlideProps {
  children: React.ReactNode;
  className?: string;
}

export function TemplateCarouselSlide({
  children,
  className,
}: TemplateCarouselSlideProps) {
  return (
    <div
      data-template-slide
      className={cn(
        "w-[min(85vw,320px)] shrink-0 snap-start sm:w-[300px] lg:w-[340px]",
        className
      )}
    >
      {children}
    </div>
  );
}
