import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    // Keep Next.js from guessing the workspace root when multiple lockfiles exist.
    root: projectRoot,
  },
};

export default nextConfig;
