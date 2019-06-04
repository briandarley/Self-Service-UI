import injector from 'vue-inject';

function UserProfileService(httpHandlerService) {
    return {

        async getLdapUserProfile(userId) {
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.get(`/userprofiles/${userId}/ldap-profile`);

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
        async getAdUserProfile(userId) {
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.get(`/userprofiles/${userId}/ad-profile`);

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
        async getMimsPrimaryDesignation(userId) {
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.get(`/UserProfiles/${userId}/mims-profile/dual-roles`);

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
        async getMimsHospitalProfile(userId) {
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.get(`/UserProfiles/${userId}/mims-profile/hospital-profile`);

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
        async updateMimsPrimaryDesignation(userId, designation) {
            try {

                const handler = await httpHandlerService.get();


                let response = await handler.put(`/UserProfiles/${userId}/mims-profile/dual-roles/${designation}`);

                return response.data;

            } catch (e) {
                throw e;
            }
        },
        async updatePrimaryAlias(userId, alias) {

            try {

                const handler = await httpHandlerService.get();


                let response = await handler.put(`/UserProfiles/${userId}/ad-profile/primary-alias/${alias}/set-primary`);

                return response.data;

            } catch (e) {
                throw e;
            }
        },
        async addEmailAlias(userId, alias) {

            try {

                const handler = await httpHandlerService.get();


                let response = await handler.put(`/UserProfiles/${userId}/ad-profile/primary-alias/${alias}/add-alias`);

                return response.data;

            } catch (e) {
                throw e;
            }
        },
        async removeEmailAlias(userId, alias) {

            try {

                const handler = await httpHandlerService.get();
                
                let response = await handler.delete(`/UserProfiles/${userId}/ad-profile/primary-alias/${alias}/remove-alias`);

                return response.data;

            } catch (e) {
                throw e;
            }
        },

        async getAvailableDomains(userId) {
            try {

                const handler = await httpHandlerService.get();


                let response = await handler.get(`/UserProfiles/${userId}/allowed-domains`);

                return response.data;

            } catch (e) {
                throw e;
            }
        }

    }
}

injector.service('UserProfileService', ["httpHandlerService"], UserProfileService);