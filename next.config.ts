import type { NextConfig } from 'next';

const isDocker = process.env.IS_DOCKER === 'true';

const nextConfig: NextConfig = {
    output: isDocker ? 'standalone' : undefined,
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
