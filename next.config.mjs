/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Domain yang sudah ada sebelumnya:
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
      },

      // --- TAMBAHKAN BARIS INI ---
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      // ---------------------------
    ],
  },
};

export default nextConfig;