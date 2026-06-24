import type { ReactNode } from "react";

export function confirmDeleteDescription(
  label: string,
  context = "from your portfolio"
): ReactNode {
  return (
    <>
      Remove{" "}
      <span className="font-medium text-foreground">&ldquo;{label}&rdquo;</span>{" "}
      {context}? This cannot be undone.
    </>
  );
}
