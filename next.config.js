/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ignoreBuildErrors:true,
	typescript: { ignoreBuildErrors: true  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "cdn.discordapp.com"
      }
    ]
  }
};

module.exports = nextConfig
