import injector from 'vue-inject';

function UserProfileService(httpHandlerService) {
    return {
        
        async getLdapUserProfile(userId){
            try {
                
                const handler = await httpHandlerService.get();
                
                let response = await handler.get(`/userprofiles/ldap-profiles/${userId}`);

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
        async getMimsPrimaryDesignation(userId){
            try {
                
                const handler = await httpHandlerService.get();
                
                let response = await handler.get(`/UserProfiles/mims-profiles/${userId}/dual-roles`);

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
        async getMimsHospitalProfile(userId){
            try {
                
                const handler = await httpHandlerService.get();
                
                let response = await handler.get(`/UserProfiles/mims-profiles/${userId}/hospital-profile`);

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
        async updateMimsPrimaryDesignation(userId, designation){
            try {
                                    
                const handler = await httpHandlerService.get();
                
                
                let response = await handler.put(`/UserProfiles/mims-profiles/${onyen}/dual-roles/{designation}`);

                return response.data;

            } catch (e) {
                throw e;
            }
        }
    }
}

injector.service('UserProfileService',  ["httpHandlerService"], UserProfileService);