/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors https://vk.com https://vk.ru https://*.vk.com https://*.vk.ru 'self';",
          },
        ],
      },
    ]
  },
}

export default nextConfig
