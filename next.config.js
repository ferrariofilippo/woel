/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wzqpecahcaruphgylsfu.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**"
      }
    ]
  }
}

module.exports = nextConfig
