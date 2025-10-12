/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Anda bisa menambahkan hostname lain di sini nanti
    ],
  },
};



export default nextConfig;
