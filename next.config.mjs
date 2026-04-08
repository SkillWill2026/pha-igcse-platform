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
    optimizePackageImports: ['@excalidraw/excalidraw'],
  },
  transpilePackages: ['@excalidraw/excalidraw'],
  webpack: (config, { isServer }) => {
    // Handle canvas module issues for both Excalidraw and pdfjs-dist
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      }
    }

    return config
  },
};

export default nextConfig;
