import injector from 'vue-inject';


function ConfigReaderService($) {
    return {
        async getConfiguration() {

            let axios = injector.get("axios");

            var configuration = await axios.get('configuration.json');
            const environment = configuration.data.environment;

            if (environment !== "local") {
                if (window.location.protocol !== "https:") {
                    location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
                }
            }
            let oidcSettings = {};
            let response = {};
            response = $.extend(response, configuration.data);
            switch (environment) {
                case "local":
                    oidcSettings = await axios.get('oidc.config.local.json');
                    break;
                case "test":
                    oidcSettings = await axios.get('oidc.config.test.json');
                    break;
                case "uat":
                    oidcSettings = await axios.get('oidc.config.uat.json');
                    break;
                case "production":
                    oidcSettings = await axios.get('oidc.config.production.json');
                    break;
                default:
                    throw "Environment not found or not supported";
                    
            }


            response = $.extend(response, oidcSettings.data);
            return response;
        },
        async getConfigurationSetting(key) {
            const config = await this.getConfiguration();
            return config[key];
        }

    }
}

injector.service('ConfigReaderService', ['$'], ConfigReaderService);