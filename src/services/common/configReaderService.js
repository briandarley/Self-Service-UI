import injector from 'vue-inject';
import {
    Config,
    LocalOidcConfig,
    TestOidcConfig,
    ProductionOidcConfig
} from 
'../../assets/index';





function ConfigReaderService() {
    return {
        async getConfiguration() {
           //const environment = Config.environment;
           let axios = injector.get("axios");
           
           
           var configuration =  await axios.get('configuration.json');
           const environment = configuration.data.environment;




           if (environment !== "local") {
               if (window.location.protocol !== "https:") {
                   location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
               }
           }
           let oidcSettings = {};
           switch (environment) {
               case "local":
                 oidcSettings = await axios.get('oidc.config.local.json');
                return oidcSettings.data;
                   //return LocalOidcConfig;
               case "test":
                oidcSettings = await axios.get('oidc.config.test.json');
                return oidcSettings.data;
                   
               case "production":
                oidcSettings = await axios.get('oidc.config.production.json');
               return oidcSettings.data;
                   //return ProductionOidcConfig;
               default:
                   throw "Environment not found or not supported";
           }

        },
        async getConfigurationSetting(key) {
           const config = await this.getConfiguration();
           return config[key];
        }
        
    }
}

injector.service('ConfigReaderService', ConfigReaderService);