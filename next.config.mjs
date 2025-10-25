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
      // Anda bisa hapus 'example.com' jika tidak lagi relevan
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },

  // --- BAGIAN INI YANG PERLU DITAMBAHKAN ---
  webpack: (config, { isServer }) => {
    // Konfigurasi ini penting untuk @sparticuz/chromium agar Vercel menyertakan file .br
    if (isServer) {
      config.externals.push({
        '@sparticuz/chromium': 'commonjs @sparticuz/chromium',
      });
    }
    return config;
  },
  // ------------------------------------------
};

export default nextConfig;