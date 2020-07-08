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
        // async getDepartments() {
        //     try {

        //         const handler = await httpHandlerService.get(60000);

        //         let response = await handler.get(`/massmail/departments`);

        //         return response.data.sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase()) ? -1 : 1);



        //     } catch (e) {
        //         if (e.message.includes("404")) {
        //             return {
        //                 status: false
        //             };
        //         }
        //         throw e;
        //     }


        // },
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
        async getMassMailRecord(id, active) {
            try {
                const handler = await httpHandlerService.get(60000);

                let uri = `/massmail/campaigns?id=${id}`;
                if (active) {
                    uri += '&active=true';
                }

                let response = await handler.get(uri);
                let pagedResponse = response.data;

                if (pagedResponse.totalRecords == 0) {
                    return {
                        status: false
                    }
                }

                return pagedResponse.entities;

            } catch (e) {
                if (e.message.includes("404") || e.message.includes("401")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        },
        async getMassMailRecords(criteria) {
            try {
                const handler = await httpHandlerService.get();
                let queryParams = commonExtensions.convertToQueryParams(criteria);

                let uri = `/massmail/campaigns?${queryParams}`;

                let response = await handler.get(uri);

                let pagedResponse = response.data;

                return pagedResponse;

            } catch (e) {
                if (e.message.includes("404") || e.message.includes("401")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        },
        async getCampaignActions(campaignId) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.get(`/MassMail/campaign-actions/${campaignId}`);

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
       
        async getMassMailUserProfile(onyen) {
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
           
            if(model.comments && Array.isArray(model.comments))
            {
                model.comments = model.comments[0];
            }
            
            if (!model.id) {
                
                model.id = await this._addNewCampaign(model);
            } else {
                
                let response = await this._updateNewCampaign(model);
                if (response.status == false) {
                    return response;
                }
            }
            return model;
        },
        async _addNewCampaign(model) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.post(`/massmail/campaigns`, model);

                return response.data;


            } catch (e) {
                throw e;
            }
        },
        async _updateNewCampaign(model) {
            try {
                const handler = await httpHandlerService.get();
                                
                await handler.put(`/massmail/campaigns/${model.id}`, model);

                return true;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false,
                        message: "Not Found"
                    };
                }
                throw e;
            }
        },
        async updateStatus(model) {
            try {
                const handler = await httpHandlerService.get();

                await handler.put(`/massmail/campaign-status/${model.campaignId}`, model);

                return true;
            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false,
                        message: "Not Found"
                    };
                }
                throw e;
            }
        },
        async addAction(model) {
            try {
                const handler = await httpHandlerService.get();

                let entity = JSON.parse(JSON.stringify(model));
                entity.campaignId = model.id;

                delete entity.id;


                await handler.post(`/massmail/campaign-actions/${model.id}`, entity);

                return true;
            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false,
                        message: "Not Found"
                    };
                }
                throw e;
            }
        },
        async addComment(model) {
            try {
                const handler = await httpHandlerService.get();

                await handler.post(`/massmail/campaign-comments/${model.campaignId}`, model);

                return true;
            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false,
                        message: "Not Found"
                    };
                }
                throw e;
            }
        },
        async getComments(campaignId) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.get(`/MassMail/campaign-comments/${campaignId}`);

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
        async cloneCampaign(campaignId) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.post(`/massmail/campaigns/${campaignId}/clone`);

                return response.data;
            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false,
                        message: "Not Found"
                    };
                }
                throw e;
            }
        },
        async addFavoriteReviewer(email) {
            try {
                const handler = await httpHandlerService.get();

                await handler.post(`/massmail/favorite-reviewers/${email}`);

                return true;
            } catch (e) {
                throw e;
            }
        },
        async deleteFavoriteReviewer(email) {
            try {
                const handler = await httpHandlerService.get();

                await handler.delete(`/massmail/favorite-reviewers/${email}`);

                return true;
            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false,
                        message: "Not Found"
                    };
                }
                throw e;
            }
        },
        async getFavoriteReviewers() {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.get(`/MassMail/favorite-reviewers`);

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
        async sendTestCampaign(campaignId, recipients) {
            try {
                const handler = await httpHandlerService.get();

                await handler.post(`/massmail/send-test-message/${campaignId}`, recipients);

                return true;
            } catch (e) {
                throw e;
            }


        },
        async verifyCampaignReceipt(campaignId, onyen) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.get(`/massmail/campaigns/${campaignId}/recipients/${onyen}/verify-receipt`);

                return response.data;
            } catch (e) {
                return false;

            }


        },
        async getCampaignReadStatistics(campaignId) { 
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.get(`/massmail/campaigns/${campaignId}/read-statistics`);

                return response.data;
            } catch (e) {
                return false;

            }
        },
        async getUserActivity(criteria) {
            try {
                const handler = await httpHandlerService.get();
                let queryParams = commonExtensions.convertToQueryParams(criteria);
                let response = await handler.get(`/massmail/campaigns/${criteria.campaignId}/user-activity?${queryParams}`);
                return response.data;
            } catch (e) {
                
                return false;

            }
        },
        async getAudienceCodeValueDisplayOrder() {
            try {
                const handler = await httpHandlerService.get(60000);
                let response = await handler.get(`/massmail/mass-mail-audience/audience-code-value-display-order`);
                return response.data.entities;
            } catch (e) {
                
                return false;

            }
        }

    }
}

injector.service('MassMailService', ["httpHandlerService", "CommonExtensions"], MassMailService);