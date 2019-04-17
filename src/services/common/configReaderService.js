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
           const environment = Config.environment;

           if (environment !== "local") {
               if (window.location.protocol !== "https:") {
                   location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
               }
           }

           switch (environment) {
               case "local":
                   return LocalOidcConfig;
               case "test":
                   return TestOidcConfig;
               case "production":
                   return ProductionOidcConfig;
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