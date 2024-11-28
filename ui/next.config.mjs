/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        domains: ['node101.s3.eu-central-1.amazonaws.com'],
        unoptimized: true
    },
    trailingSlash: true,

};

export default nextConfig;
