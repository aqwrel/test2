// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  chainWebpack: (config, { isProd, isClient }) => {
    if (isProd && isClient) {
      config.optimization.splitChunks({
        chunks: "initial",
        maxInitialRequests: Infinity,
      });
    }
  },
  siteName: 'Gridsome',
  prefetch: { mask: '^$' },
  plugins: []
}
