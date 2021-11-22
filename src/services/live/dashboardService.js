import injector from "vue-inject";
/* eslint-disable */
// eslint-disable-next-line
function DashboardService(moment, httpHandlerService, commonExtensions) {
  return {
    async getNextGalSync() {
      //http://its-idmtst-web.adtest.unc.edu/Services/business.selfservice.api/v1/Dashboard/last-gal-sync
      const handler = await httpHandlerService.get(10000);
      let response = await handler.get("dashboard/last-gal-sync");

      let value = moment.utc(response.data);
      value.add(31, "minutes");
      return value;
    },
    async getMyAdGroups() {
      try {
        const handler = await httpHandlerService.get(10000);
        //returns a list of group names in which the authenticated user belongs
        let response = await handler.get("dashboard/my-assigned-groups");

        return response;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getMyManagedGroups(criteria) {
      try {
        const handler = await httpHandlerService.get();

        let queryParams = commonExtensions.convertToQueryParams(criteria);

        let response = await handler.get(
          `dashboard/my-managed-groups?${queryParams}`
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
    async getMyManagedGroupMembers(criteria) {
      try {
        const handler = await httpHandlerService.get();

        let queryParams = commonExtensions.convertToQueryParams(criteria);

        let response = await handler.get(
          `dashboard/my-managed-groups/${criteria.groupSamAccountName}/members?${queryParams}`
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
    async getMyManagedGroupManagers(groupSamAccountName) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `dashboard/my-managed-groups/${groupSamAccountName}/managers`
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
    async getPagedAdEntities(criteria) {
      try {
      const handler = await httpHandlerService.get();
      
      let queryParams = commonExtensions.convertToQueryParams(criteria);
      
      let response = await handler.get(
          `dashboard/ad-entities?${queryParams}`
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
    async addMemberToGroup(groupDn, memberDn) {
      try {
      const handler = await httpHandlerService.get();
           
      
      let response = await handler.post(
          `dashboard/my-managed-groups/${groupDn}/members/${memberDn}`
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
    async removeGroupMemberFromGroup(groupDn, memberDn) {
      try {
      const handler = await httpHandlerService.get();
           
      
      let response = await handler.delete(
          `dashboard/my-managed-groups/${groupDn}/members/${memberDn}`
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
    async addManagerToGroup(groupDn, memberDn) {
      try {
      const handler = await httpHandlerService.get();
           
      
      let response = await handler.post(
          `dashboard/my-managed-groups/${groupDn}/managers/${memberDn}`
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
    async removeManagerFromGroup(groupDn, memberDn) {
      try {
      const handler = await httpHandlerService.get();
           
      
      let response = await handler.delete(
          `dashboard/my-managed-groups/${groupDn}/managers/${memberDn}`
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


    async getAdUserProfile(newAlias) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(`dashboard/my-ad-profile/${newAlias}`);

        return response.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },

    async toggleMfa(){
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.post(`dashboard/reset-mfa`);

        return response.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    }
    
    
    

    
    

    
    
    

    
    

    
  };
}

injector.service(
  "DashboardService",
  ["moment", "httpHandlerService", "CommonExtensions"],
  DashboardService
);
