import injector from 'vue-inject';
import wrapper from 'axios-cache-plugin'


function httpHandlerService(axios, configReaderService, userService) {
    return {
        _httpHandler: null,
        async get(cacheLength) {
            const serviceEndpoint = await configReaderService.getConfigurationSetting("serviceEndpoint")
            
            const user = await userService.get();
            
            const instance = axios.create({

                baseURL: serviceEndpoint,
                headers: {
                    //"Access-Control-Allow-Origin": "*",
                    "Authorization": `Bearer ${user.access_token}`,
                    "Content-Type": "application/json"
                },

            });

            if (cacheLength) {
                this._httpHandler = wrapper(instance, {
                    maxCacheSize: 1000,
                    ttl: cacheLength
                });
            } else {
                this._httpHandler = instance;
            }



            return this._httpHandler;
        },
        async getFullyQualifiedHttpHandler(serviceEndpoint) {
            

            const user = await userService.get();

            const instance = axios.create({

                baseURL: serviceEndpoint,
                headers: {
                    //"Access-Control-Allow-Origin": "*",
                    "Authorization": `Bearer ${user.access_token}`,
                    "Content-Type": "application/json"
                },

            });

            this._httpHandler = instance;



            return this._httpHandler;
        }

    }

}

injector.service('httpHandlerService', ['axios', 'ConfigReaderService', 'UserService'], httpHandlerService);