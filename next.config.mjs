/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  images: {
    remotePatterns: [

      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'api.qrserver.com' },
      { protocol: 'https', hostname: 'example.com' }, 
    ],
  },


  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium'],
  },
};

export default nextConfig;