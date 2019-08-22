// vue.config.js
const configure = require('./src/api/configure')

module.exports = {
  devServer: {
    after(app, devServer) {
      // HACK: Using setTimeout is a pretty nasty way to get ahold of
      // the actual HTTP server the Webpack DevServer spins up.
      // Unfortunately there is no hook for post-initialization.
      setTimeout(() => {
        const { listeningApp: server } = devServer
        configure(app, server)
      }, 2500)
    }
  },

  baseUrl: undefined,
  outputDir: undefined,
  assetsDir: 'assets',
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined,

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')

    // clear all existing loaders.
    // if you don't do this, the loader below will be appended to
    // existing loaders of the rule.
    svgRule.uses.clear()

    // add replacement loader(s)
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
  }
}
