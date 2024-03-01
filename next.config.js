const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./lib/i18n/settings.ts');
/** @type {import('next').NextConfig} */
const nextConfig = {
  // pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wzqpecahcaruphgylsfu.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**"
      }
    ]
  },
}

module.exports = withNextIntl(nextConfig);
