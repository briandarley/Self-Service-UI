module.exports = {
  
  publicPath: './',
  runtimeCompiler: true,
    css: {
      
      loaderOptions: {
        sass: {
          data: `
            @import "static/scss/variables.scss";
            @import "static/scss/_chartist-settings.scss";
            //@import "node_modules/bootstrap/scss/bootstrap.scss";
            

            
          `
        }
      }
    }
  };