/** @type {import('next').NextConfig} */
const nextConfig = {
  // Autorise les images locales /public
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
  // Désactive les suggestions ESLint qui bloquent le build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
