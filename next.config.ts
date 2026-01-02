/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['gycwmzuhblxsxhdyvyhl.supabase.co', 'lh3.googleusercontent.com'],
  },
  // Thêm đoạn dưới này vào
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig