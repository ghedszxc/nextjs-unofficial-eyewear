import { useEffect, useRef, useState } from "react";

export type Breakpoints = Record<string, number>;

export type BreakpointState = {
  width: number;
  height: number;
  current: "mobile" | "tablet" | "laptop" | "desktop";
  matches: Record<string, boolean>;
};

export function useBreakpoint(breakpoints: Breakpoints): BreakpointState {
  // Sort breakpoints by smallest to largest
  const sortedEntries = Object.entries(breakpoints).sort((a, b) => a[1] - b[1]);

  const getCurrentBreakpoint = (width: number) => {
    // Start with the smallest breakpoint
    let active = sortedEntries[0][0];
    for (const [name, minWidth] of sortedEntries) {
      if (width >= minWidth) {
        active = name;
      }
    }
    return active;
  };

  const [state, setState] = useState<BreakpointState>(() => ({
    width: 0,
    height: 0,
    current: "mobile",
    matches: {},
  }));

  // A ref to store the animation frame ID.
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const current = getCurrentBreakpoint(width) as "mobile" | "tablet" | "laptop" | "desktop";

      const matches: Record<string, boolean> = {};
      for (const [name, minWidth] of sortedEntries) {
        matches[name] = width >= minWidth;
      }

      setState({ width, height, current, matches });
    };

    // Cancels the previous animation frame and then schedules a new one
    // Avoids unnecessary re-renders
    const onResize = () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
      frame.current = requestAnimationFrame(update);
    };

    update(); // initial load
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return state;
}
