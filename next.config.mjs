/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Domain yang sudah ada sebelumnya:
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'api.qrserver.com' },
      { protocol: 'https', hostname: 'example.com' }, // Hapus jika tidak perlu
    ],
  },

  // --- GUNAKAN KONFIGURASI INI ---
  experimental: {
    // Memberitahu Next.js/Vercel untuk menyertakan package ini di serverless function
    serverComponentsExternalPackages: ['@sparticuz/chromium'],
  },
  // Hapus atau komentari konfigurasi webpack lama jika ada
  // webpack: (config, { isServer }) => {
  //     if (isServer) {
  //         config.externals.push({
  //             '@sparticuz/chromium': 'commonjs @sparticuz/chromium',
  //         });
  //     }
  //     return config;
  // },
  // ---------------------------------
};

export default nextConfig;