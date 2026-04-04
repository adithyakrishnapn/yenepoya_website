/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mudipu.yenepoyauniversity.online",
        pathname: "/assets/**"
      }
    ]
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid intermittent corrupted cache packs on Windows dev sessions.
      config.cache = false;
    }
    return config;
  }
};

export default nextConfig;
