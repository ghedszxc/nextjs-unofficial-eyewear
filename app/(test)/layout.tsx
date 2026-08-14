import "../globals.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";

const gtAmerticaStandardRegular = localFont({
  src: "../../public/fonts/GT-America-Standard-Regular.woff2",
  variable: "--font-gt-america-standard-regular",
  display: "swap",
  preload: true,
  weight: "400",
  style: "normal",
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

const gtAmericaStandardLight = localFont({
  src: "../../public/fonts/GT-America-Standard-Light.woff2",
  variable: "--font-gt-america-standard-light",
  display: "swap",
  preload: false,
  weight: "300",
  style: "normal",
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

const gtAmerticaExpandedBold = localFont({
  src: "../../public/fonts/GT-America-Expanded-Bold.woff2",
  variable: "--font-gt-america-expanded-bold",
  display: "swap",
  preload: false,
  weight: "700",
  style: "normal",
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

const gtAmerticaExtendedBold = localFont({
  src: "../../public/fonts/GT-America-Extended-Bold.woff2",
  variable: "--font-gt-america-extended-bold",
  display: "swap",
  preload: false,
  weight: "700",
  style: "normal",
  adjustFontFallback: false,
  fallback: ["sans-serif"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "antialiased",
          gtAmerticaStandardRegular.className,
          gtAmericaStandardLight.variable,
          gtAmerticaExpandedBold.variable,
          gtAmerticaExtendedBold.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
