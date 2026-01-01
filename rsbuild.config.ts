import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

// Docs: https://rsbuild.rs/config/
export default defineConfig({
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
  ],
});
