import injector from 'vue-inject';

function MassMailService(httpHandlerService) {
    return {
        async getCurrentMassMailByUser() {
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.get(`/massmail/campaigns/saved`);

                return response.data.entities;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        },
        async removeMassMailCampaign(campaignId) {
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.delete(`/massmail/campaigns/${campaignId}`);

                return response.data.entities;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        },
        async getDepartments() {
            try {

                const handler = await httpHandlerService.get(60000);

                let response = await handler.get(`/massmail/departments`);

                return response.data.sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : 1);



            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }


        },
        async getMassMailAudienceTotals() {
            try {

                const handler = await httpHandlerService.get(60000);

                let response = await handler.get(`/massmail/create-request/audience-criteria/totals`);

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

injector.service('MassMailService', ["httpHandlerService"], MassMailService);