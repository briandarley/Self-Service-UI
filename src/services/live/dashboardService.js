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
           debugger;
      
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

    
    
    
    

    
    

    
    
    

    
    

    // async getAllDistributionGroupEntities(id, recursively) {
    //   try {
    //     const handler = await httpHandlerService.get();
    //     if (recursively) {
    //       let response = await handler.get(
    //         `dashboard/distribution-groups/${id}/all-entities?recursively=true`
    //       );

    //       return response.data;
    //     } else {
    //       let response = await handler.get(
    //         `dashboard/distribution-groups/${id}/all-entities`
    //       );

    //       return response.data;
    //     }
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // }
    // async getDistributionGroupMembers(id) {
    //   try {
    //     const handler = await httpHandlerService.get();
    //     let response = await handler.get(
    //       `dashboard/distribution-groups/${id}/members`
    //     );
    //     {
    //       return response.data;
    //     }
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // },
    // async getDistributionGroupManagers(id) {
    //   try {
    //     const handler = await httpHandlerService.get();
    //     let response = await handler.get(
    //       `dashboard/distribution-groups/${id}/managers`
    //     );
    //     {
    //       return response.data;
    //     }
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // },
    // async addGroupManager(groupId, memberId) {
    //   try {
    //     const handler = await httpHandlerService.get();
    //     let response = await handler.put(
    //       `dashboard/distribution-groups/${groupId}/managers/${memberId}`
    //     );
    //     return response.data;
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // },
    // async removeGroupManager(groupId, memberId) {
    //   try {
    //     const handler = await httpHandlerService.get();

    //     let response = await handler.delete(
    //       `dashboard/distribution-groups/${groupId}/managers/${memberId}`
    //     );

    //     return response.data;
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // },
    // async removeGroupManager(groupId, memberId) {
    //   try {
    //     const handler = await httpHandlerService.get();

    //     let response = await handler.delete(
    //       `dashboard/distribution-groups/${groupId}/managers/${memberId}`
    //     );
    //     return response.data;
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // },
    // async findMember(uniqueId) {
    //   const handler = await httpHandlerService.get();
    //   let response = await handler.get(`dashboard/ad-user/${uniqueId}`);
    //   return response;
    // },
    // async getDistributionGroups(criteria) {
    //   try {
    //     let queryParams = commonExtensions.convertToQueryParams(criteria);

    //     const handler = await httpHandlerService.get();
    //     let list = await handler.get(
    //       `dashboard/distribution-groups?${queryParams}`
    //     );

    //     return list.data;
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // },
    // async getExchangeUser(id) {
    //   try {
    //     const handler = await httpHandlerService.get();

    //     let response = await handler.get(
    //       `dashboard/ad-tools/exchange-users/${id}`
    //     );

    //     return response.data;
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // },
    // async removeMember(groupId, memberId) {
    //   try {
    //     const handler = await httpHandlerService.get();

    //     //await handler.delete(`distribution-groups/${groupId}/members/${memberId}`);
    //     await handler.delete(
    //       `dashboard/my-ad-groups/${groupId}/members/${memberId}`
    //     );
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // },
    // async addGroupMember(groupId, memberId, recursively) {
    //   try {
    //     const handler = await httpHandlerService.get();
    //     if (!recursively) {
    //       let response = await handler.put(
    //         `dashboard/distribution-groups/${groupId}/members/${memberId}`
    //       );
    //       return response.data;
    //     } else {
    //       let response = await handler.put(
    //         `dashboard/distribution-groups/${groupId}/members/${memberId}?recursively=true`
    //       );
    //       return response.data;
    //     }
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // },
    // async getContact(id) {
    //   try {
    //     const handler = await httpHandlerService.get();

    //     let response = await handler.get(`/dashboard/ad-tools/contacts/${id}`);

    //     return response.data;
    //   } catch (e) {
    //     if (e.message.includes("404")) {
    //       return {
    //         status: false,
    //       };
    //     }
    //     throw e;
    //   }
    // },
  };
}

injector.service(
  "DashboardService",
  ["moment", "httpHandlerService", "CommonExtensions"],
  DashboardService
);
