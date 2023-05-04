const bundleTracker = require('webpack-bundle-tracker')
const ip = process.env.FRONTEND_SERVER_IP || 'localhost'
const port = process.env.FRONTEND_SERVER_PORT || 8080
const mode = process.env.NODE_ENV
const isProduction = mode === 'production'
const prodStaticUrlPrefix = '/static'

process.env.VUE_APP_SENTRY_DSN = process.env.SENTRY_DSN_FRONTEND

module.exports = {
  publicPath: isProduction ? `${prodStaticUrlPrefix}/` : `http://${ip}:${port}`,
  indexPath: './public/index.html',
  outputDir: './dist/',
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.optimization.splitChunks(false)

    config.plugin('BundleTracker').use(bundleTracker, [{ filename: './webpack-stats.json' }])

    config.resolve.set('symlinks', false)

    config.resolve.alias.set('__STATIC__', 'static')

    config.devServer
      .public(`http://0.0.0.0:${port}`)
      .host('0.0.0.0')
      .port(port)
      .hotOnly(true)
      .watchOptions({ poll: 1000 })
      .https(false)
      .headers({ 'Access-Control-Allow-Origin': ['*'] })
  },

  devServer: {
    publicPath: '/',
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  transpileDependencies: ['vuetify'],
  pluginOptions: {
    i18n: {
      locale: 'ru',
      fallbackLocale: 'ru',
      localeDir: 'languages',
      enableInSFC: true,
    },
  },
  // generate sourceMap for production build?
  productionSourceMap: isProduction,
}
