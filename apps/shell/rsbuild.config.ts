import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  server: {
    port: 3003,
  },
  output: {
    assetPrefix: '/web',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["postcss-loader"],
        type: "css/auto",
      },
    ],
  },
  plugins: [
    pluginReact(),
    pluginSass(),
    pluginModuleFederation({
      name: 'rslib_consumer',
      remotes: {
        rslib_provider: 'rslib_provider@http://localhost:3004/mf-manifest.json',
      },
    }),
  ],
});
