/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep pdf-parse and mammoth in Node.js — they use fs/Buffer and break in the edge runtime
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth', '@anthropic-ai/sdk'],
  },
};

export default nextConfig;
