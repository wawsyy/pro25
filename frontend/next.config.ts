import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers() {
    // FHEVM requires both COOP and COEP headers for SharedArrayBuffer support
    // Note: This may cause issues with some wallet providers, but is required for FHEVM
    return Promise.resolve([
      {
        source: '/',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ]);
  },
  // Disable error overlay in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

export default nextConfig;

