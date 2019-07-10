import injector from 'vue-inject';

function AdministrationService(httpHandlerService, commonExtensions,routeSourcesService) {
    return {
        async getRoutes(criteria) {
            try {
                if(!criteria){
                    criteria = {};
                }
                if(!criteria.routeId){
                    criteria.routeId = 0;
                }
                let data = await routeSourcesService.getFlattenedMenu();

                return  data;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        }
    }
}

injector.service('AdministrationService', ["httpHandlerService", "CommonExtensions","RouteSourcesService"], AdministrationService);