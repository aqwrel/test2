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
        cacheGroups: {
          vueVendor: {
            test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
            name: "vue-vendors",
          },
          gridsome: {
            test: /[\\/]node_modules[\\/](gridsome|vue-meta)[\\/]/,
            name: "gridsome-vendors",
          },
          polyfill: {
            test: /[\\/]node_modules[\\/]core-js[\\/]/,
            name: "core-js",
          },
        },
      });
    }
  },
  siteName: 'Gridsome',
  plugins: []
}
