/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["lens.infura-ipfs.io"],
  },
};

module.exports = nextConfig;
