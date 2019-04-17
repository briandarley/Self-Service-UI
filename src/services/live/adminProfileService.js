import injector from 'vue-inject';

function AdminProfileService(httpHandlerService) {
    return {
        async getAdminProfile(){
            try {
                const handler = await httpHandlerService.get(10000);
        
                let response = await handler.get("adminprofiles");
        
                return response.data;
              } catch (e) {
                if (e.message.includes("404")) {
                  return [];
                }
                throw e;
              }
        }
    }
}

injector.service('AdminProfileService', ['httpHandlerService'], AdminProfileService);