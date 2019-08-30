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
      css: {
        data: `
          @import '~bootstrap-datepicker/dist/css/bootstrap-datepicker.css';
          @import '~daterangepicker/daterangepicker.css';
          `
      },
      sass: {
        data: `
            @import "static/scss/variables.scss";
            @import "static/scss/_chartist-settings.scss";
            @import "~vue-toastr/src/vue-toastr.scss";
            
            //@import "node_modules/bootstrap/scss/bootstrap.scss";
            

            
          `
      }
    }
  }
};