const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 } as const;
type Breakpoint = keyof typeof BREAKPOINTS;

/** Mobile-first, like Tailwind: imageSizes({ base: "50vw", lg: "25vw" }) */
export function imageSizes(spec: { base: string } & Partial<Record<Breakpoint, string>>) {
  const conditions = (Object.keys(BREAKPOINTS) as Breakpoint[])
    .filter((bp) => spec[bp])
    .sort((a, b) => BREAKPOINTS[b] - BREAKPOINTS[a]) // largest first: first match wins
    .map((bp) => `(min-width: ${BREAKPOINTS[bp]}px) ${spec[bp]}`);
  return [...conditions, spec.base].join(", ");
}
