/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unsplash.com",
        port: "",
        //        pathname: "/photos/**",
      },
    ],
  },
};

module.exports = nextConfig;
