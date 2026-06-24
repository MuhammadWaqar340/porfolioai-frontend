export function unlockDocumentScroll() {
  if (typeof document === "undefined") return;

  const html = document.documentElement;
  const body = document.body;

  html.removeAttribute("data-base-ui-scroll-locked");
  html.style.removeProperty("overflow");
  html.style.removeProperty("overflow-x");
  html.style.removeProperty("overflow-y");
  html.style.removeProperty("scrollbar-gutter");
  html.style.removeProperty("scroll-behavior");
  html.style.removeProperty("height");

  body.style.removeProperty("position");
  body.style.removeProperty("height");
  body.style.removeProperty("width");
  body.style.removeProperty("box-sizing");
  body.style.removeProperty("overflow");
  body.style.removeProperty("overflow-x");
  body.style.removeProperty("overflow-y");
  body.style.removeProperty("scroll-behavior");
}
