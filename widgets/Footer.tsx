"use client";

import Image from "next/image";
import Link from "next/link";
import { IFooter } from "@/models/widgets/IFooter";
import { useEffect, useRef } from "react";
import { useFooterVisibility } from "@/lib/contexts/FooterContext";

const DEFAULT_TAGLINE =
  "UNOFFICIAL IS AN EYEWEAR BRAND THAT BELIEVES IN EMBRACING EVERY SIDE OF YOURSELF. \nTHE UNEXPECTED YOU.";

const DEFAULT_SOCIAL = {
  icon: "/icons/instagram.svg",
  title: "STAY IN TOUCH",
  hashtag: "#REFRAMETHEORDINARY",
  href: "https://www.instagram.com/unofficial.eyewear/",
};

const DEFAULT_COPYRIGHT =
  "Copyright ⓒ 2026 GrandVision Group Holding B.V. All rights reserved.\nUNOFFICIAL and the UNOFFICIAL logo are registered trademarks of GrandVision Group Holding B.V.";

const DEFAULT_LOGO = { src: "/icons/unf-logo-footer-d.svg", alt: "Unofficial Logo" };

const Footer = ({
  tagline = DEFAULT_TAGLINE,
  social = DEFAULT_SOCIAL,
  navigationLinks,
  copyright = DEFAULT_COPYRIGHT,
  logo = DEFAULT_LOGO,
}: Partial<IFooter>) => {
  const copyrightLines = copyright.split(/\r?\n/);
  const taglineLines = tagline.split(/\r?\n/)

  const footerRef = useRef<HTMLDivElement>(null);
  const { setIsFooterVisible } = useFooterVisibility();

  useEffect(() => {
    const footerElement = footerRef.current;
    if (!footerElement) return;

    // IntersectionObserver to detect when footer enters viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Footer is visible when it intersects the viewport
        setIsFooterVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of footer is visible
      }
    );

    observer.observe(footerElement);

    return () => observer.disconnect();
  }, [setIsFooterVisible]);

  return (
    <footer ref={footerRef} className="h-auto w-full border-t border-white bg-black p-2 lg:border-none lg:px-8">
      <div className="p-8 pb-10 lg:grid lg:grid-cols-2 lg:gap-19 lg:px-0 lg:pb-20">
        {/* <h3 className="max-[1440px]:hidden h3-bold font-gt-america-expanded-bold mb-10 text-white lg:mb-0">
          {taglineLines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h3> */}
        <div>
          <h3 className="min-[1440px]:w-[642px] h3-bold font-gt-america-expanded-bold mb-10 text-white lg:mb-0">
            {tagline}
          </h3>
        </div>

        <div className="flex flex-col gap-8">
          <div className="mb-6 flex flex-row items-start lg:mb-0">
            <Link href={social.href} target="_blank">
              <Image
                src={social.icon}
                alt={`${social.title} Logo`}
                height={33}
                width={33}
                unoptimized
                className="shrink-0"
              />
            </Link>
            <h4 className="h4-bold font-gt-america-extended-bold pl-3 text-white">
              {social.title}
              <br />
              {social.hashtag}
            </h4>
          </div>

          <ul className="lg:flex lg:gap-8">
            {navigationLinks?.map((link) => (
              <li key={link.href} className="leading-4">
                <Link
                  href={link.href}
                  target={link.isExternal ? "_blank" : undefined}
                  className="font-gt-america-standard-light text-xs font-light text-white/80"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>

          <p className="font-gt-america-standard-light text-xs font-light text-white/80">
            {copyrightLines.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        </div>
      </div>

      <Image src={logo.src} alt={logo.alt} width={9999} height={74} unoptimized />
    </footer>
  );
};
export default Footer;
