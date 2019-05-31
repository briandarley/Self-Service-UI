import injector from 'vue-inject';

function ProvisionsService(httpHandlerService,userService) {
    return {
        async getProvisionRecord(userId) {

        },
        async getProvisionRecord(userId) {
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.get(`/provisions/${userId}`);

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
        async submitNewProvisionRequest(onyen, model){
            try {
                                    
                const handler = await httpHandlerService.get();
                //for single string posts, we need to wrap value in quotes, otherwise we'll need to pass a formal model
                
                let response = await handler.post(`/provisions/${onyen}`, "\"" + model.mail + "\"");

                return response.data;

            } catch (e) {
                throw e;
            }
        }
        
    }
}

injector.service('ProvisionsService', ['httpHandlerService','UserService'], ProvisionsService);