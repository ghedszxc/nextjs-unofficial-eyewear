"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import breakpoints from "@/constants/breakpoints";
interface BackButtonProps {
  label?: string;
  href?: string; // optional: navigate to a specific route instead of going back
  className?: string;
}

const BackButton = ({ label = "Back", href, className }: BackButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  // const { current } = useBreakpoint(breakpoints);

  const getFallbackUrl = (path: string): string => {
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 1) {
      segments.pop();
      return "/" + segments.join("/");
    }
    // If only one segment, go to root
    return "/";
  };

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      // Check if there's actual browser history
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        // Fallback: navigate to parent route based on current pathname
        router.push(getFallbackUrl(pathname));
      }
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={`font-gt-america-standard-light flex cursor-pointer items-center gap-6 p-0! text-lg text-black hover:bg-transparent ${className ?? ""}`}
    >
      <Image src="/icons/chevron-left.svg" alt="Back" width={16.31} height={30.96} className="h-full object-contain" unoptimized />
      {label}
    </Button>
  );
};

export default BackButton;
