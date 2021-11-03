const webpack = require('webpack')

module.exports = {

  publicPath: './',
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/
      })
    ]
  },
  css: {

    loaderOptions: {
     
      sass: {
        sassOptions: {
        includePaths: ['./node_modules', './node_modules/@material'],
        },
        additionalData: `
            @import "static/scss/variables.scss";
            @import "static/scss/_chartist-settings.scss";
            @import "~vue-toastr/src/vue-toastr.scss";
           
          `
      }
    }
  }
};