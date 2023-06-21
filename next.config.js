/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");

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

module.exports = withPlugins(
	[
		[
			withPWA,
			{
				pwa: {
					dest: "public",
				},
			},
		],
		// 추가 플러그인 작성
	],
	nextConfig
);