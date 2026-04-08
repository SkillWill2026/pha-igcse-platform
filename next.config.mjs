/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Keep pdf-parse and mammoth in Node.js — they use fs/Buffer and break in the edge runtime
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth', '@anthropic-ai/sdk'],
  },
  webpack: (config, { isServer }) => {
    // Handle canvas module issues
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    }

    // Exclude pdfjs-dist from minification to avoid import.meta issues
    if (!isServer) {
      const TerserPlugin = config.optimization.minimizer.find(
        (minimizer) => minimizer.constructor.name === 'TerserPlugin'
      )
      if (TerserPlugin) {
        TerserPlugin.options.exclude = [
          ...(TerserPlugin.options.exclude || []),
          /pdfjs-dist/,
          /pdf\.worker/,
        ]
      }
    }

    return config
  },
};

export default nextConfig;
