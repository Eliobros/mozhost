import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para Docker
  output: 'standalone',
  
  // Configurações de segurança
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  
  // Configurações de imagem (opcional)
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
