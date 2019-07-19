import injector from 'vue-inject';

function AdministrationService(httpHandlerService, routeSourcesService) {
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
        },
        async getGroupMembers(samAccountName){
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.get(`/Administrations/ad-groups/${samAccountName}/members`);

                return response.data;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }

          
        },
        async removeGroupMember(groupName, samAccountName){
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.delete(`/Administrations/ad-groups/${groupName}/members/${samAccountName}`);

                return response.data;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        },
        async addGroupMember(groupName, samAccountName){
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.post(`/Administrations/ad-groups/${groupName}/members/${samAccountName}`);

                return response.data;

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

injector.service('AdministrationService', ["httpHandlerService","RouteSourcesService"], AdministrationService);