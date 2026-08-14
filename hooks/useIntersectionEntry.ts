import { RefObject, useEffect, useState } from "react";

export function useIntersectionEntry<T extends HTMLElement>(
  targetRef: RefObject<T>,
  options?: IntersectionObserverInit
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([observerEntry]) => {
      setEntry(observerEntry);
    }, options);

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return entry;
}
