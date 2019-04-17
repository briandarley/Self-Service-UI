import injector from "vue-inject";

function ListManagerService(httpHandlerService, commonExtensions) {
  return {
    async getMySubscriptions() {
      try {
        const handler = await httpHandlerService.get(10000);

        let response = await handler.get("listmanager/lists/subscriptions");

        return response.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async queryListsByName(nameLike) {
      const handler = await httpHandlerService.get();

      let routeData = await handler.get(`listmanager/lists?filter=${nameLike}`);

      return routeData.data;
    },
    async getListsByName(name) {
      const handler = await httpHandlerService.get();

      let routeData = await handler.get(`listmanager/lists?listName=${name}`);

      return routeData.data;
    },
    async getEmailAddresses() {
      try {
        const handler = await httpHandlerService.get();

        let emailRequest = await handler.get(
          `listmanager/admin/my-email-addresses`
        );

        return emailRequest.data.filter(c => c.endsWith("unc.edu"));
      } catch (e) {
        if (e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async getDormantLists(email) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `listmanager/admin/dormant-list/${email}`
        );

        return response.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async getMyOwnedLists(email) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `listmanager/lists?memberEmailAddress=${email}&isAdmin=true`
        );
        return response.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async getListByListNameFilter(name) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(`listmanager/lists?filter=${name}`);
        return response.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async getListByEmailFilter(email) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `listmanager/lists?MemberEmailAddress=${email}`
        );
        return response.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async getListByEmailPasswordFilter(criteria) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `listmanager/lists?MemberEmailAddress=${criteria.email}&password=${
            criteria.password
          }`
        );
        return response.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async getSubscribersByListName(name) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(`listmanager/lists/${name}/members`);
        return response.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async updateSubscriber(model) {
      try {
        const handler = await httpHandlerService.get();

        if (model.newEmailAddress && model.isListAdmin) {
          if (!model.newEmailAddress.toLowerCase().endsWith("unc.edu")) {
            throw "All Admin e-mail addresses must end with 'unc.edu'";
          }
        }

        let response = await handler.put(
          `listmanager/lists/${model.listName}/members/${model.emailAddress}`,
          model
        );

        return response.data;
      } catch (e) {
        if (e.message && e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },

    async getListMetrics(listName) {
      try {
        const handler = await httpHandlerService.get();
        let response = await handler.get(
          `listmanager/lists/${listName}/metrics`
        );

        return [response.data];
      } catch (e) {
        throw e;
      }
    },
    async addSubscriber(model) {
      try {
        const handler = await httpHandlerService.get();

        if (!model.fullName || !model.emailAddress || !model.listName) {
          throw "Invalid model, propeties are invalid";
        }

        if (model.emailAddress && model.isListAdmin) {
          if (!model.emailAddress.toLowerCase().endsWith("unc.edu")) {
            throw "All Admin e-mail addresses must end with 'unc.edu'";
          }
        }

        let memberRequest = await handler.get(
          `listmanager/lists/${model.listName}/members`
        );

        if (memberRequest.data.length) {
          if (
            memberRequest.data.some(
              c =>
                c.emailAddress.toLowerCase() ===
                model.emailAddress.toLowerCase()
            )
          ) {
            throw "Member already exists";
          }
        }

        let response = await handler.post(
          `listmanager/lists/${model.listName}/members`,
          model
        );

        return response.data;
      } catch (e) {
        if (e.message && e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async removeSubscriber(model) {
      try {
        const handler = await httpHandlerService.get();

        if (!model.emailAddress || !model.listName) {
          throw "Invalid model, propeties are invalid";
        }

        await handler.delete(
          `listmanager/lists/${model.listName}/members/${model.emailAddress}`
        );
      } catch (e) {
        if (e.message && e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async toggleListEnable(model) {
      try {
        const handler = await httpHandlerService.get();
        model.disabled = !model.disabled;

        //if (!model.emailAddress || !model.listName) {
        //  throw "Invalid model, propeties are invalid";
        //}

        await handler.put(`listmanager/lists/${model.listName}`, model);
      } catch (e) {
        if (e.message && e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async toggleSubsciberCap(model) {
      try {
        const handler = await httpHandlerService.get();
        model.maxMembers = model.maxMembers === 0 ? 300 : 0;

        await handler.put(`listmanager/lists/${model.listName}`, model);
      } catch (e) {
        if (e.message && e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async deleteList(model) {
      try {
        const handler = await httpHandlerService.get();

        await handler.delete(`listmanager/lists/${model.listName}`);
      } catch (e) {
        if (e.message && e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async addNewList(model) {
      try {
        const handler = await httpHandlerService.get();

        if (!model.listName || !model.password || !model.emailAddress) {
          throw "Invalid model, propeties are invalid";
        }

        if (!model.emailAddress.toLowerCase().endsWith("unc.edu")) {
          throw "All Admin e-mail addresses must end with 'unc.edu'";
        }

        let response = await handler.post("listmanager/lists", model);

        return response.data;
      } catch (e) {
        if (e.message && e.message.includes("404")) {
          return [];
        }
        throw e;
      }
    },
    async getDeletionList(criteria) {
      try {
        const handler = await httpHandlerService.get();
        criteria.includeSubcriberCounts = true;
        let queryParams = commonExtensions.convertToQueryParams(criteria);

        let response = await handler.get(
          `listmanager/lists/deletions?${queryParams}`
        );

        return response.data;
      } catch (e) {
        throw e;
      }
    },
    async getSubscriberDump(listName) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `listmanager/lists/deletions/${listName}/members`
        );

        return response.data;
      } catch (e) {
        throw e;
      }
    }
  };
}

injector.service(
  "ListManagerService",
  ["httpHandlerService", "CommonExtensions"],
  ListManagerService
);
