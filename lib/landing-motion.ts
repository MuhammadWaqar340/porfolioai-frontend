/** Shared Framer Motion configs for the landing page. */

export const landingSpring = {
  type: "spring" as const,
  stiffness: 120,
  damping: 18,
  mass: 0.8,
};

export const landingSpringSnappy = {
  type: "spring" as const,
  stiffness: 220,
  damping: 22,
  mass: 0.6,
};

export const landingEase = [0.22, 1, 0.36, 1] as const;

export const landingHoverTransition = {
  duration: 0.35,
  ease: landingEase,
};

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};
