import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'rslib_provider',
      exposes: {
        './ProductCard': './src/components/ProductCard/index.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 3004,
    cors: { origin: '*' },
  },
  output: {
    assetPrefix: 'http://localhost:3004',
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
});