import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                hostname: 'cdn.discordapp.com',
                protocol: 'https',
            },
        ],
    },
};

export default nextConfig;
