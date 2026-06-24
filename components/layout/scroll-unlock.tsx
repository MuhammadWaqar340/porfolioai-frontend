"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { unlockDocumentScroll } from "@/lib/unlock-document-scroll";

export function ScrollUnlock() {
  const pathname = usePathname();

  useEffect(() => {
    unlockDocumentScroll();
  }, [pathname]);

  useEffect(() => {
    unlockDocumentScroll();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        unlockDocumentScroll();
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return null;
}
