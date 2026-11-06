const development = process.env.NODE_ENV === "development";

// Next's statically generated pages hydrate from inline scripts. Block inline event
// handlers separately and limit browser requests to the assets and film the site uses.
const policy = [
  "default-src 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "frame-src https://www.youtube-nocookie.com",
  "script-src 'self' 'unsafe-inline'" + (development ? " 'unsafe-eval'" : ""),
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'" + (development ? " ws: wss:" : ""),
  "form-action 'self' mailto:",
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    // Transform the site's published images, not API responses or arbitrary query variants.
    localPatterns: [
      "/alumni", "/campus", "/career-centre", "/home", "/news", "/parents",
      "/programmes", "/prospectus", "/research", "/_next/static/media",
    ].map(directory => ({ pathname: directory + "/**", search: "" })),
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "Content-Security-Policy", value: policy },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};

export default nextConfig;
