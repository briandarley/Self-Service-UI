import injector from 'vue-inject';
/* eslint-disable */
// eslint-disable-next-line
function DashboardService(moment, httpHandlerService) {
  return {
    async getNextGalSync() {
      //http://its-idmtst-web.adtest.unc.edu/Services/business.selfservice.api/v1/Dashboard/last-gal-sync
      const handler = await httpHandlerService.get(10000);
      let response = await handler.get('dashboard/last-gal-sync');

      let value = moment.utc(response.data);
      value.add(31, 'minutes');
      return value;



    },
    async getAdUserProfile(newAlias) {
      try {

        const handler = await httpHandlerService.get();

        let response = await handler.get(`/dashboard/my-ad-profile/${newAlias}`);

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

    async getMyAdGroups() {

      try {
        const handler = await httpHandlerService.get(10000);
        let response = await handler.get('dashboard/my-ad-groups');


        return response;
      } catch (e) {

        if (e.message.includes("404")) {
          return {
            status: false
          };
        }
        throw e;
      }
    },


    // async getGroupMembers(samAccountName) {
    //   try {

    //     return {
    //       data: [{
    //           "samAccountName": "mattocks",
    //           "distinguishedName": "CN=Taron Mattocks (mattocks),OU=Users,OU=Identity,DC=ad,DC=unc,DC=edu",
    //           "employeeId": "700083103",
    //           "cn": null
    //         },
    //         {
    //           "samAccountName": "romana",
    //           "distinguishedName": "CN=Leslie Quattlebaum (romana),OU=Users,OU=Identity,DC=ad,DC=unc,DC=edu",
    //           "employeeId": "703026080",
    //           "cn": null
    //         },
    //         {
    //           "samAccountName": "diliang",
    //           "distinguishedName": "CN=Di Liang (diliang),OU=Users,OU=Identity,DC=ad,DC=unc,DC=edu",
    //           "employeeId": "711693450",
    //           "cn": null
    //         },
    //         {
    //           "samAccountName": "woodhous",
    //           "distinguishedName": "CN=Diana Knobloch Woodhouse (woodhous),OU=Users,OU=Identity,DC=ad,DC=unc,DC=edu",
    //           "employeeId": "711880243",
    //           "cn": null
    //         }
    //       ]
    //     }



    //     const handler = await httpHandlerService.get(10000);
    //     let response = await handler.get(`dashboard/my-ad-groups/{samAccountName}/members`);
    //     return response;
    //   } catch (e) {

    //   }
    // },

    async findMember(uniqueId) {

      const handler = await httpHandlerService.get();
      let response = await handler.get(`dashboard/ad-user/${uniqueId}`);
      return response;
    }



  }
}

injector.service('DashboardService', ['moment', 'httpHandlerService'], DashboardService);