import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Les types Supabase seront régénérés automatiquement via la CLI Supabase
    // Une fois les types auto-générés intégrés, retirer cette option
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
