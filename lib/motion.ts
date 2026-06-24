/** Shared transition and animation class strings */
export const motion = {
  transition: "transition-all duration-300 ease-out motion-reduce:transition-none",
  transitionFast: "transition-all duration-200 ease-out motion-reduce:transition-none",
  transitionColors:
    "transition-colors duration-200 ease-out motion-reduce:transition-none",
  transitionTransform:
    "transition-transform duration-300 ease-out motion-reduce:transition-none",
  hoverLift:
    "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none motion-reduce:hover:shadow-none",
  hoverScale:
    "transition-transform duration-300 ease-out hover:scale-[1.02] motion-reduce:transform-none",
  pageEnter: "animate-page-enter",
  fadeInUp: "animate-fade-in-up opacity-0",
  fadeIn: "animate-fade-in opacity-0",
  scaleIn: "animate-scale-in opacity-0",
} as const;

export const animationDelays = {
  75: "animation-delay-75",
  100: "animation-delay-100",
  150: "animation-delay-150",
  200: "animation-delay-200",
  250: "animation-delay-250",
  300: "animation-delay-300",
  350: "animation-delay-350",
  400: "animation-delay-400",
  500: "animation-delay-500",
} as const;
