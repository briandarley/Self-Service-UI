import injector from 'vue-inject';

function ExchangeToolsService(httpHandlerService,commonExtensions) {
    return {
        async getProvisionHistory(uid) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.get(
                    `WinTools/exchange-tools/provision/${uid}`
                );

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
        async getUserLdap(uid) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.get(
                    `WinTools/ldap/users/${uid}`
                );

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
        async submitProvisionRequest(uid, emailAddresses) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.post(
                    `WinTools/exchange-tools/provision/${uid}`, emailAddresses
                );

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
        async getAdUser(uid) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.get(`WinTools/ad/users?samAccountName=${uid}`);

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
        async getAdUserByEmail(email) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.get(`WinTools/ad/users?ProxyAddress=${email}`);

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
        async setPrimaryAlias(uid, emailAddress) {
            try {
                const handler = await httpHandlerService.get();

                await handler.put(`WinTools/ad/users/${uid}/primary-smtp/${emailAddress}`);

                return true;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }

        },
        async addAlias(uid, emailAddress) {
            try {
                const handler = await httpHandlerService.get();

                let response = await handler.post(`WinTools/ad/users/${uid}/smtp/${emailAddress}`);

                return response.data.entity;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }

        },
        async removeAlias(uid, emailAddress) {
            try {
                const handler = await httpHandlerService.get();

                await handler.delete(`WinTools/ad/users/${uid}/smtp/${emailAddress}`);

                return true;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }

        },
        async getResources(uid) {
            try {
                const handler = await httpHandlerService.get();

                let list = await handler.get(`WinTools/exchange-tools/exchange-acls/${uid}`);

                return list.data;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        },
        async getCompromisedAccounts(uid) {
            try {
                const handler = await httpHandlerService.get();
                if (uid) {
                    let list = await handler.get(`WinTools/exchange-tools/compromised-accounts/${uid}`);
                    return [list.data];
                } else {
                    let list = await handler.get(`WinTools/exchange-tools/compromised-accounts`);
                    return list.data;
                }

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }

        },
        async getMfaAccountStatus(uid) {
            try {
                const handler = await httpHandlerService.get();
                let list = await handler.get(`WinTools/exchange-tools/mfa/mfa-account-status/${uid}`);
                
                if(list.data){
                    list.data.enabled = list.data.mfaEnabled;
                }
                return list.data;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        },
        async updateMfaAccountStatus(model){
            try {
                const handler = await httpHandlerService.get();
                model.mfaEnabled = model.enabled;
                if(model.selectedMfaDate){
                    let dates = model.selectedMfaDate.toString().split(" - ");
                    
                    if( dates.length > 1){
                        model.mfaExemptBeginDate = dates[0];
                        model.mfaExemptEndDate = dates[1];
                    }
                    else{
                        model.mfaExemptEndDate  = model.selectedMfaDate;
                    }
                    
                }
                
                model.uid = model.onyen;
                
                //reason and incidentNumber are already members of the model;
                await handler.put(`WinTools/exchange-tools/mfa/mfa-account-status/${model.uid}`,model);
                

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        },
        async getMfaDisabledRecords(criteria){
            try {
                let queryParams = commonExtensions.convertToQueryParams(criteria);

                const handler = await httpHandlerService.get();
                let list = await handler.get(`WinTools/exchange-tools/mfa/mfa-account-status?${queryParams}`);
                
                return list.data;

            } catch (e) {
                if (e.message.includes("404")) {
                    return {
                        status: false
                    };
                }
                throw e;
            }
        }, 
        async getMfaMethodType(uid){
            try {
                const handler = await httpHandlerService.get();
                let response = await handler.get(`WinTools/exchange-tools/mfa/mfa-method-type/${uid}`);
                
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

injector.service('ExchangeToolsService', ["httpHandlerService","CommonExtensions"], ExchangeToolsService);