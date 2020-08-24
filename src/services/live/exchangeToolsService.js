import injector from "vue-inject";

function ExchangeToolsService(httpHandlerService, commonExtensions) {
  return {
    async getProvisionHistory(uid) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `WinTools/exchange-tools/provisions/${uid}`
        );

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
    async getProvisionHistories(criteria) {
      try {
        const handler = await httpHandlerService.get();

        let queryParams = commonExtensions.convertToQueryParams(criteria);

        let response = await handler.get(
          `WinTools/exchange-tools/provisions?${queryParams}`
        );

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
    async getUserLdap(uid) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(`WinTools/ldap/users/${uid}`);

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
    async submitProvisionRequest(uid, emailAddresses) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.post(
          `WinTools/exchange-tools/provisions/${uid}`,
          emailAddresses
        );

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
    async updateProvisionRecord(model) {
      try {
        const handler = await httpHandlerService.get();

        await handler.put(
          `wintools/exchange-tools/provisions/${model.onyen}`,
          model
        );

        return {
          status: true,
        };
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },

    async getAdUsers(criteria) {
      try {
        const handler = await httpHandlerService.get();
        let queryParams = commonExtensions.convertToQueryParams(criteria);

        let response = await handler.get(`WinTools/ad/users?${queryParams}`);
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
    async getAdEntities(criteria) {
      try {
        const handler = await httpHandlerService.get();
        let queryParams = commonExtensions.convertToQueryParams(criteria);

        let response = await handler.get(`WinTools/ad/entities?${queryParams}`);
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
    async unlockAdUser(userId) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.put(
          `WinTools/exchange-tools/ad-tools/account-info/ad-info/${userId}/unlock-ad-account`
        );

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

    async setPrimaryAlias(userId, emailAddress) {
      try {
        const handler = await httpHandlerService.get();

        await handler.put(
          `WinTools/ad/users/${userId}/primary-smtp/${emailAddress}`
        );

        return true;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async addAlias(userId, emailAddress) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler
          .post(`WinTools/ad/users/${userId}/smtp/${emailAddress}`)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            throw { message: error.response.data };
          });

        return response.data.entity;
      } catch (e) {
        return {
          message: e.message,
          status: false,
        };
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
            status: false,
          };
        }
        throw e;
      }
    },
    async getResources(uid) {
      try {
        const handler = await httpHandlerService.get();

        let list = await handler.get(
          `WinTools/exchange-tools/exchange-acls/${uid}`
        );

        return list.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getCompromisedAccounts(uid) {
      try {
        const handler = await httpHandlerService.get();
        if (uid) {
          let list = await handler.get(
            `WinTools/exchange-tools/compromised-accounts/${uid}`
          );
          return [list.data];
        } else {
          let list = await handler.get(
            `WinTools/exchange-tools/compromised-accounts`
          );
          return list.data;
        }
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getMfaAccountStatus(uid) {
      try {
        const handler = await httpHandlerService.get();
        let list = await handler.get(
          `WinTools/exchange-tools/mfa/mfa-account-status/${uid}`
        );

        if (list.data) {
          list.data.enabled = list.data.mfaEnabled;
        }
        return list.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async updateMfaAccountStatus(model) {
      try {
        const handler = await httpHandlerService.get();
        model.mfaEnabled = model.enabled;
        if (model.selectedMfaDate) {
          let dates = model.selectedMfaDate.toString().split(" - ");

          if (dates.length > 1) {
            model.mfaExemptBeginDate = dates[0];
            model.mfaExemptEndDate = dates[1];
          } else {
            model.mfaExemptEndDate = model.selectedMfaDate;
          }
        }

        model.uid = model.onyen;

        //reason and incidentNumber are already members of the model;
        await handler.put(
          `WinTools/exchange-tools/mfa/mfa-account-status/${model.uid}`,
          model
        );
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getMfaDisabledRecords(criteria) {
      try {
        let queryParams = commonExtensions.convertToQueryParams(criteria);

        const handler = await httpHandlerService.get();
        let list = await handler.get(
          `WinTools/exchange-tools/mfa/mfa-account-status?${queryParams}`
        );

        return list.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getMfaMethodType(uid) {
      try {
        const handler = await httpHandlerService.get();
        let response = await handler.get(
          `WinTools/exchange-tools/mfa/mfa-method-type/${uid}`
        );

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
    async toggleMfa(uid) {
      try {
        const handler = await httpHandlerService.get();

        await handler.put(
          `WinTools/exchange-tools/mfa/mfa-account-status/${uid}/toggle-mfa-status`
        );
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
      //
    },
    async getOrganizationalUnits() {
      try {
        const handler = await httpHandlerService.get(10000);

        let response = await handler.get(
          `WinTools/systems/organizational-units`
        );

        return response.data;
      } catch (e) {
        window.console.log(e);
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getAdToolsAccountInfoLdapAuditInfo(id) {
      try {
        const handler = await httpHandlerService.get();
        let entity = await handler.get(
          `WinTools/exchange-tools/ad-tools/account-info/ldap-info/${id}`
        );

        return entity.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getAdToolsAccountInfoActiveDirectoryAuditInfo(id) {
      try {
        const handler = await httpHandlerService.get();
        let entity = await handler.get(
          `WinTools/exchange-tools/ad-tools/account-info/ad-info/${id}`
        );

        return entity.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getCampusDirectoryAuditInfo(id) {
      try {
        const handler = await httpHandlerService.get();
        let entity = await handler.get(
          `WinTools/exchange-tools/ad-tools/account-info/campus-directory/${id}`
        );

        return entity.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getOffice365AuditInfo(id) {
      try {
        const handler = await httpHandlerService.get();
        let entity = await handler.get(
          `WinTools/exchange-tools/ad-tools/account-info/office-365/${id}`
        );
        return entity.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getSplunk(criteria) {
      try {
        let queryParams = commonExtensions.convertToQueryParams(criteria);

        const handler = await httpHandlerService.get();
        let list = await handler.get(
          `WinTools/exchange-tools/ad-tools/account-info/lockouts?${queryParams}`
        );

        return list.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getDistributionGroups(criteria) {
      try {
        let queryParams = commonExtensions.convertToQueryParams(criteria);

        const handler = await httpHandlerService.get();
        let list = await handler.get(
          `WinTools/exchange-tools/ad-tools/distribution-groups?${queryParams}`
        );

        return list.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getDistributionGroup(id) {
      try {
        const handler = await httpHandlerService.get();
        let list = await handler.get(
          `WinTools/exchange-tools/ad-tools/distribution-groups/${id}`
        );

        return list.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getAllDistributionGroupEntities(id, recursively) {
      try {
        const handler = await httpHandlerService.get();
        if (recursively) {
          let response = await handler.get(
            `/WinTools/exchange-tools/ad-tools/distribution-groups/${id}/all-entities?recursively=true`
          );

          return response.data;
        } else {
          let response = await handler.get(
            `/WinTools/exchange-tools/ad-tools/distribution-groups/${id}/all-entities`
          );

          return response.data;
        }
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getDistributionGroupMembers(id) {
      try {
        const handler = await httpHandlerService.get();
        let response = await handler.get(
          `/WinTools/exchange-tools/ad-tools/distribution-groups/${id}/members`
        );
        {
          return response.data;
        }
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getDistributionGroupManagers(id) {
      try {
        const handler = await httpHandlerService.get();
        let response = await handler.get(
          `/WinTools/exchange-tools/ad-tools/distribution-groups/${id}/managers`
        );
        {
          return response.data;
        }
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    async getSharedMailbox(samAccountName) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `/WinTools/systems/shared-mailbox/${samAccountName}`
        );

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
    async getContact(id) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `/WinTools/exchange-tools/ad-tools/contacts/${id}`
        );

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
    async getExchangeUser(id) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `/WinTools/exchange-tools/ad-tools/exchange-users/${id}`
        );

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
    async removeMember(groupId, distinguishedName) {
      try {
        const handler = await httpHandlerService.get();

        await handler.delete(
          `/WinTools/exchange-tools/ad-tools/distribution-groups/${groupId}/members/${distinguishedName}`
        );
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },
    // async getOrganizationalUnits() {
    //   try {
    //     const handler = await httpHandlerService.get();
    //     let list = await handler.get(`WinTools/systems/organizational-units`);

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
    async createSharedMailbox(model) {
      try {
        const handler = await httpHandlerService.get();
        let response = await handler.post(
          `WinTools/systems/shared-mailbox`,
          model
        );

        return response.data;
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
      //
    },
    // async addGroupMember(groupId, memberId, recursively) {
    //   try {
    //     const handler = await httpHandlerService.get();
    //     if (!recursively) {
    //       let response = await handler.put(
    //         `/wintools/exchange-tools/ad-tools/distribution-groups/${groupId}/members/${memberId}`
    //       );
    //       return response.data;
    //     } else {
    //       let response = await handler.put(
    //         `/wintools/exchange-tools/ad-tools/distribution-groups/${groupId}/members/${memberId}?recursively=true`
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
    // async removeGroupMember(groupId, memberId) {
    //   try {
    //     const handler = await httpHandlerService.get();

    //     let response = await handler.delete(
    //       `/wintools/exchange-tools/ad-tools/distribution-groups/${groupId}/members/${memberId}`
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
    // async addGroupManager(groupId, memberId) {
    //   try {
    //     const handler = await httpHandlerService.get();
    //     let response = await handler.put(
    //       `/wintools/exchange-tools/ad-tools/distribution-groups/${groupId}/managers/${memberId}`
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
    //       `/wintools/exchange-tools/ad-tools/distribution-groups/${groupId}/managers/${memberId}`
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
    async getAdminAliases(criteria) {
      try {
        const handler = await httpHandlerService.get();
        let queryParams = commonExtensions.convertToQueryParams(criteria);

        let response = await handler.get(
          `/WinTools/systems/alias-authority?${queryParams}`
        );

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
    async getAliasManagers(criteria) {
      try {
        const handler = await httpHandlerService.get();

        let queryParams = commonExtensions.convertToQueryParams(criteria);

        let response = await handler.get(
          `/WinTools/systems/alias-managers?${queryParams}`
        );

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
    async removeAliasManager(domains, uid) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.delete(
          `/WinTools/systems/alias-manager/${uid}`,
          { data: domains }
        );

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
    async addAliasManager(domains, uid) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.post(
          `/WinTools/systems/alias-manager/${uid}`,
          domains
        );

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
    _promise_getAliasDomains: null,
    async getAliasDomains() {
      try {
        //multiple calls are occurring at the same time, prevent this with the promise,
        //clear promise after 5 sec
        if (this._promise_getAliasDomains) {
          let response = await this._promise_getAliasDomains;
          setTimeout(() => {
            this._promise_getAliasDomains = null;
          }, 5000);
          return response;
        }

        return (this._promise_getAliasDomains = new Promise(async (resolve) => {
          const handler = await httpHandlerService.get();

          let response = await handler.get(`/WinTools/systems/alias-domains`);

          resolve(response.data);
        }));
      } catch (e) {
        if (e.message.includes("404")) {
          return {
            status: false,
          };
        }
        throw e;
      }
    },

    async addAuthorizedDomain(userID, domain) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.post(
          `/WinTools/systems/alias-authority/${userID}/domains/${domain}`
        );

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
    async removeAuthorizedDomain(userId, domain) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.delete(
          `/WinTools/systems/alias-authority/${userId}/domains/${domain}`
        );

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
    async getOffice365Mailbox(userId) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.get(
          `/WinTools/exchange-tools/ad-tools/office365-mailboxes/${userId}`
        );

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

    async setForwardingAddress(userId, forwardingAddress) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.put(
          `/WinTools/exchange-tools/ad-tools/office365-mailboxes/${userId}/forwarding-smtp-address`,
          '"' + forwardingAddress + '"'
        );

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
    async getAuthorizedServiceAccounts() {
      //
      try {
        const handler = await httpHandlerService.get(10000);

        let response = await handler.get(
          `WinTools/exchange-tools/ad-tools/ad-groups/authorized-service-accounts`
        );

        return response.data;
      } catch (e) {
        let message = e;
        if (e.response) {
          message = e.response.data;
        }

        //if (e.message.includes("404")) {
        return {
          status: false,
          message: message,
        };
        //}
        //throw e;
      }
    },
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

        //if (e.message.includes("404")) {
        return {
          status: false,
          message: message,
        };
        //}
        //throw e;
      }
    },
    async getAdGroupMembers(criteria) {
      try {
        const handler = await httpHandlerService.get();

        let queryParams = commonExtensions.convertToQueryParams(criteria);
        let dnFriendly = encodeURIComponent(criteria.distinguishedName);

        let response = await handler.get(
          `WinTools/exchange-tools/ad-tools/ad-groups/${dnFriendly}/members?${queryParams}`
        );

        return response.data;
      } catch (e) {
        let message = e;
        if (e.response) {
          message = e.response.data;
        }

        //if (e.message.includes("404")) {
        return {
          status: false,
          message: message,
        };
        //}
        //throw e;
      }
    },
    async getAdGroupManagers(groupDn) {
      try {
        const handler = await httpHandlerService.get();

        let dnFriendly = encodeURIComponent(groupDn);

        let response = await handler.get(
          `WinTools/exchange-tools/ad-tools/ad-groups/${dnFriendly}/managers`
        );

        return response.data;
      } catch (e) {
        let message = e;
        if (e.response) {
          message = e.response.data;
        }

        //if (e.message.includes("404")) {
        return {
          status: false,
          message: message,
        };
        //}
        //throw e;
      }
    },

    async addAdGroupMember(groupDn, memberDn) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.post(
          `/WinTools/exchange-tools/ad-tools/ad-groups/${groupDn}/members`,
          '"' + memberDn + '"'
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
    async removeAdGroupMember(groupDn, memberDn) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.delete(
          `/WinTools/exchange-tools/ad-tools/ad-groups/${groupDn}/members/${memberDn}`
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
    async addAdGroupManager(groupDn, managerDn) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.post(
          `/WinTools/exchange-tools/ad-tools/ad-groups/${groupDn}/managers`,
          '"' + managerDn + '"'
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
    async removeAdGroupManager(groupDn, managerDn) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.delete(
          `/WinTools/exchange-tools/ad-tools/ad-groups/${groupDn}/managers/${managerDn}`
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
    async addGroupToQueue(model) {
      try {
        const handler = await httpHandlerService.get();

        let response = await handler.post(
          `/WinTools/exchange-tools/ad-tools/ad-group-queues`,
          model
        );

        return response.data;
      } catch (e) {
        let message = e;
        if (e.response) {
          message = e.response.data;
        }

        //if (e.message.includes("404")) {
        return {
          status: false,
          message: message,
        };
        //}
        //throw e;
      }
    },
    async deleteAdGroup(criteria) {
      try {
        const handler = await httpHandlerService.get();

        let queryParams = commonExtensions.convertToQueryParams(criteria);

        let response = await handler.delete(
          `WinTools/exchange-tools/ad-tools/ad-groups/${
            criteria.distinguishedName
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
    },
    async uploadAdMemberFiles(data, options) {
      try {
        let callback = options.fileUploadProgress;
        let groupDn = options.distinguishedName;

        const handler = await httpHandlerService.get();
        //Note CORS errors like 'No headers found will occur if the max file size is exceeded, setting up the server to except larger files will resolve this
        let response = await handler.post(
          `/WinTools/exchange-tools/ad-tools/ad-groups/${groupDn}/members/file`,
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
  };
}

injector.service(
  "ExchangeToolsService",
  ["httpHandlerService", "CommonExtensions"],
  ExchangeToolsService
);
