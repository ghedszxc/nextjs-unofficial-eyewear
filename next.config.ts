import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  trailingSlash: true,
  serverExternalPackages: ["pino", "pino-pretty"],
  images: {
    // Route every next/image through Storyblok's image service.
    loader: "custom",
    loaderFile: "./lib/storyblok-image.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
      },
      {
        protocol: "https",
        hostname: "images.prismic.io",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(icons|images|scripts)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
