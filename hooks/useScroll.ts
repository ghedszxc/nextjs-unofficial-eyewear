import { useEffect, useRef, useState } from "react";

export function useScroll() {
  const [y, setY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const ticking = useRef(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setScrollDirection(currentY > lastY.current ? "down" : "up");
          lastY.current = currentY;
          setY(window.scrollY);
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    setY(window.scrollY);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return { scrollY: y, scrollDirection };
}
