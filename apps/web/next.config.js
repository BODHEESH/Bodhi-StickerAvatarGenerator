/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'nano-banana-stickers-storage.s3.amazonaws.com'],
  },
  experimental: {
    esmExternals: 'loose',
  },
  webpack: (config, { isServer }) => {
    // Exclude undici from webpack processing to avoid parsing issues
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push('undici');
    }

    // Handle ES modules properly
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
}

module.exports = nextConfig
