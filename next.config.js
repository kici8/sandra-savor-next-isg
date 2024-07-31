/** @type {import('next').NextConfig} */
const withNextIntl = require("next-intl/plugin")();

module.exports = withNextIntl({
  // Other Next.js configuration ...
  // Webpack configuration for handling GLSL files
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: [options.defaultLoaders.babel, "raw-loader", "glslify-loader"],
    });

    return config;
  },
});
