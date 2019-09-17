import injector from 'vue-inject';

function MassMailService(httpHandlerService, commonExtensions) {
    return {
        async getCurrentMassMailByUser() {
            try {

                const handler = await httpHandlerService.get();

                let response = await handler.get(`/massmail/campaigns/my-saved-campaigns`);

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

        },
        async getMassMailRecord(id) {
            try {
                const handler = await httpHandlerService.get(60000);

                let response = await handler.get(`/massmail/campaigns?id=${id}`);

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
        async checkIfUserExists(onyen) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.get(`/MassMail/create-request/audience-criteria/users/${onyen}`);

                return response.data;
            } catch (error) {
                if (error.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw error;
            }
        },
        async save(model) {
            if (!model.id) {
                model.id = await this._addNewCampaign(model);
            } else {
                await this._updateNewCampaign(model);
            }
            return model;
        },
        async _addNewCampaign(model) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.post(`/massmail/campaigns`, model);

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
        async _updateNewCampaign(model) {
            try {
                const handler = await httpHandlerService.get();

                await handler.put(`/massmail/campaigns/${model.id}`, model);

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

injector.service('MassMailService', ["httpHandlerService", "CommonExtensions"], MassMailService);