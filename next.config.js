/** @type {import('next').NextConfig} */

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
    ],
  },
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
};
