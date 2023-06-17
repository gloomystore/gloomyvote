/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    config.plugins.push(
      new webpack.BannerPlugin({
        banner: '// This is Gloomy Vote App',
        raw: true, // Indicates that the banner should not be wrapped in a comment
      })
    );

    // Important: return the modified config
    return config;
  },
}

module.exports = nextConfig
