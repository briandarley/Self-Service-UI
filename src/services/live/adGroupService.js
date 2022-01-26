import injector from 'vue-inject';

function AdGroupService(httpHandlerService, commonExtensions) {
    return {
        async getAdGroups(criteria) {
            try {
                const handler = await httpHandlerService.get();

                let queryParams = commonExtensions.convertToQueryParams(criteria);

                
                let response = await handler.get(
                    `WinTools/exchange-tools/ad-tools/ad-groups?${queryParams}`
                );

                return response.data;
            } catch (e) {
                let message = e;
                if (e.response) {
                    message = e.response.data;
                }


                return {
                    status: false,
                    message: message,
                };

            }
        },
        async getAdGroupMembers(criteria) {
            try {
                const handler = await httpHandlerService.get();

                let queryParams = commonExtensions.convertToQueryParams(criteria);


                let response = await handler.get(
                    `WinTools/exchange-tools/ad-tools/ad-groups/${criteria.grpSamAccountName}/members?${queryParams}`
                );

                return response.data;
            } catch (e) {
                let message = e;
                if (e.response) {
                    message = e.response.data;
                }


                return {
                    status: false,
                    message: message,
                };

            }
        },
        async getAdGroupManagers(grpSamAccountName) {
            try {
                const handler = await httpHandlerService.get();



                let response = await handler.get(
                    `WinTools/exchange-tools/ad-tools/ad-groups/${grpSamAccountName}/managers`
                );

                return response.data;
            } catch (e) {
                let message = e;
                if (e.response) {
                    message = e.response.data;
                }


                return {
                    status: false,
                    message: message,
                };

            }
        },
        async addAdGroupMember(grpSamAccountName, mbrSamAccountName) {
            try {
              const handler = await httpHandlerService.get();
      
              let response = await handler.post(
                `/WinTools/exchange-tools/ad-tools/ad-groups/${grpSamAccountName}/members`,
                '"' + mbrSamAccountName + '"'
              );
      
              return response.data;
            } catch (e) {
              let message = e;
              if (e.response) {
                message = e.response.data;
              }
              return {
                status: false,
                message: message,
              };
            }
          },
          async removeAdGroupMember(grpSamAccountName, mbrSamAccountName) {
            try {
              const handler = await httpHandlerService.get();
      
              let response = await handler.delete(
                `/WinTools/exchange-tools/ad-tools/ad-groups/${grpSamAccountName}/members/${mbrSamAccountName}`
              );
      
              return response.data;
            } catch (e) {
              let message = e;
              if (e.response) {
                message = e.response.data;
              }
              return {
                status: false,
                message: message,
              };
            }
          },
          async addAdGroupManager(grpSamAccountName, mgrSamAccountName) {
            try {
              const handler = await httpHandlerService.get();
              
              
              let response = await handler.post(
                `/WinTools/exchange-tools/ad-tools/ad-groups/${grpSamAccountName}/managers`,
                `"${mgrSamAccountName}"`
              );
      
              return response.data;
            } catch (e) {
              let message = e;
              if (e.response) {
                message = e.response.data;
              }
              return {
                status: false,
                message: message,
              };
            }
          },
          async removeAdGroupManager(grpSamAccountName, mgrSamAccountName) {
            try {
              const handler = await httpHandlerService.get();
      
              let response = await handler.delete(
                `/WinTools/exchange-tools/ad-tools/ad-groups/${grpSamAccountName}/managers/${mgrSamAccountName}`
              );
      
              return response.data;
            } catch (e) {
              let message = e;
              if (e.response) {
                message = e.response.data;
              }
              return {
                status: false,
                message: message,
              };
            }
          },
          async uploadAdMemberFiles(data, options) {
            try {
              let callback = options.fileUploadProgress;
              let samAccountName = options.samAccountName;
      
              const handler = await httpHandlerService.get();
              //Note CORS errors like 'No headers found will occur if the max file size is exceeded, setting up the server to except larger files will resolve this
              let response = await handler.post(
                `/WinTools/exchange-tools/ad-tools/ad-groups/${samAccountName}/members/file`,
                data,
                {
                   headers: {
                     "Content-Type": "multipart/form-data",
                   },
                  onUploadProgress: function(progressEvent) {
                    if(callback)
                    {
                      callback(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)));
                    }
      
                  }
                }
              );
             
              return response;
      
      
            } catch (e) {
              let message = e;
              if (e.response) {
                message = e.response.data;
              }
              return {
                status: false,
                message: message,
              };
            }
          },
          async deleteAdGroup(criteria) {
            try {
              const handler = await httpHandlerService.get();
      
              let queryParams = commonExtensions.convertToQueryParams(criteria);
      
              let response = await handler.delete(
                `WinTools/exchange-tools/ad-tools/ad-groups/${
                  criteria.samAccountName
                }?${queryParams}`
              );
      
              return response.data;
            } catch (e) {
              let message = e;
              if (e.response) {
                message = e.response.data;
              }
              return {
                status: false,
                message: message,
              };
            }
          }
    }
}

injector.service('AdGroupService', ["httpHandlerService", "CommonExtensions"], AdGroupService);