import { BaseValidateMixin } from "./../../../../../components/mixins/index";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "group-managers",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "UserService",
    "ValidationService",
  ],
  filters: {
    filterCn: (value) => {
      return value.replace(/\([^)]+\)/, "");
    },
  },
})
export default class GroupManagers extends BaseValidateMixin {
  hideInfo = false;
  _currentCol = "name";
  _currentSortDir = 1;
  showAddManager = false;
  locked = true;
  groupName = "";
  authorizedServiceAccounts = [];
  groupDetail = {
    samAccountName: "",
    managedBy: []
  };
  groupManagers = [];
  pagedResponse = [];
  criteria = {
    distinguishedName: "",
  };

  modelSearch = {
    userId: "",
  };
  adUser = {};
  
  showManagerSearchResults = false;

  get canAddManager() {
    if (this.groupDetail.isExchangeGroup) {
      return true;
    }
    if (this.groupDetail.managedBy && this.groupDetail.managedBy.length == 0) {
      return true;
    }
    return false;
  }

  async mounted() {
    this.toastService.set(this);
    this.readQueryParams();

    await this.loadGroupDetails();
    await this.retrieveAuthUserDetails();
    //window.console.log(this.groupDetail);
    // this.groupName = this.$route.query.name;
    // this.ouName = this.$route.query.ouName;
    // this.criteria.distinguishedName = this.$route.query.distinguishedName;
    // this.groupDetail = await this.getGroupDetail();
    // this.groupName = this.groupDetail.samAccountName;

    if (this.criteria.distinguishedName) {
      await this.search();
    }

    this.locked = !this.canEdit();
    
  }

  async loadGroupDetails() {
    this.groupDetail = await this.getGroupDetails();
    this.groupName = this.groupDetail.samAccountName;
  }

  readQueryParams() {
    this.groupName = this.$route.query.name;
    this.ouName = this.$route.query.ouName;

    if (this.$route.query.criteria) {
      this.criteria = JSON.parse(this.$route.query.criteria);
    }
    this.criteria.distinguishedName = this.$route.query.distinguishedName;
  }

  async clear() {
    this.criteria = {
      recursiveSearch: false,
      filterText: "",
      distinguishedName: this.$route.query.distinguishedName,
      pageSize: 50,
      index: 0,
    };
    await this.search();
  }

  async getGroupDetails() {
    let groupDetailResponse = await this.ExchangeToolsService.getAdGroups({
      distinguishedName: this.criteria.distinguishedName,
    });
    return groupDetailResponse.entities[0];
  }

  async search() {
    this.spinnerService.show();
    try {
      let criteria = JSON.parse(JSON.stringify(this.criteria));
      criteria.filterText = "";

      this.authorizedServiceAccounts = await this.ExchangeToolsService.getAuthorizedServiceAccounts();
      this.groupManagers = await this.ExchangeToolsService.getAdGroupManagers(
        this.criteria.distinguishedName
      );
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to load AD members");
    } finally {
      this.spinnerService.hide();
    }
  }
  async sort(column) {
    if (this._currentCol === column) {
      this._currentSortDir *= -1;
    } else {
      this._currentSortDir = 1;
    }

    this._currentCol = column;

    this.criteria.index = 0;
    this.criteria.sort = this._currentCol;
    this.criteria.listSortDirection = this._currentSortDir;

    await this.search();
  }

  get isAdmin() {
    return this.UserService.isInRole("ITS_WSP-Access-ITSWS");
  }

  canEdit() {
    let prefixes = ["MSG_", "MDG_"];
    if(prefixes.some(c=> this.groupDetail.samAccountName.toUpperCase().startsWith(c))){
      return false;
    }
    let suffixes = ["_PSX"];
    if(suffixes.some(c=> this.groupDetail.samAccountName.toUpperCase().endsWith(c))){
      return false;
    }
  

    if (this.isAdmin) return true;

    if (!this.groupDetail.managedBy.length) {
      return false;
    }

    if (!this.currentUser || !this.currentUser.distinguishedName) {
      return false;
    }

    let matchedAccounts = this.groupDetail.managedBy.filter(
      (c) =>
        "CN=ITS_ExchMBCreate.svc,OU=MyIT,OU=WS,OU=InfraOps,OU=Service Accounts,OU=Departmental Users,OU=ITS,OU=UNC,DC=ad,DC=unc,DC=edu".toLowerCase() === c.toLowerCase()
    );

    if (matchedAccounts.length) {
      return true;
    }
    

    matchedAccounts = this.groupDetail.managedBy.filter(
      (c) =>
        this.currentUser.distinguishedName.toLowerCase() === c.toLowerCase()
    );


    

   

    if (matchedAccounts.length) {
      return true;
    }



    matchedAccounts = this.groupDetail.managedBy.filter((c) =>
      this.authorizedServiceAccounts.some((d) => d === c)
    );

    return matchedAccounts.length;
  }

  async retrieveAuthUserDetails() {
    let userId = await this.UserService.getUserName();
    let pagedResponse = await this.ExchangeToolsService.getAdUsers({
      samAccountName: userId,
    });
    this.currentUser = pagedResponse.entities[0];
  }


  goToGroupSearch() {
    let criteria = JSON.parse(this.$route.query.criteria);
    delete criteria.distinguishedName;

    this.$router.push({
      name: "ad-groups",
      query: {
        criteria: JSON.stringify(criteria),
      },
    });
  }

  goToGroupMembers() {
    this.$router.push({
      name: "ad-group-members",

      query: {
        distinguishedName: this.$route.query.distinguishedName,
        criteria: JSON.stringify(this.criteria),
      },
    });
  }


  async lookupUser() {
    this.spinnerService.show();
    try {
      //newUser.userId
      let criteria = {};
      this.modelSearch.filterText = this.modelSearch.filterText.trim();

      if(this.ValidationService.isValidEmail(this.modelSearch.filterText))
      {
        criteria.proxyAddress = this.modelSearch.filterText;
      } else if (this.modelSearch.filterText.match(/[a-zA-Z0-9]+/)) {
        criteria.samAccountName = this.modelSearch.filterText;
      } else if (this.modelSearch.filterText.match(/[a-zA-Z0-9]+/)) {
        criteria.employeeId = this.modelSearch.filterText;
      } else {
        this.toastService.error("Invalid criteria entered for manager id");
        return;
      }

      let pagedResponse = await this.ExchangeToolsService.getAdUsers(criteria);

      if (pagedResponse.totalRecords == 0) {
        this.toastService.error("User not found");
        return;
      }

      this.adUser = pagedResponse.entities[0];
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve user information");
    } finally {
      this.spinnerService.hide();
    }
  }
  async doDeleteGroupWork(criteria) {
    
   await this.ExchangeToolsService.deleteAdGroup(criteria);
   
  }
  async verifyDeleteGroup() {
    this.spinnerService.show();
    try {
      if (this.groupDetail.distinguishedName.toUpperCase().indexOf("MAILBOXES") >     -1) {
        this.$refs.confirmRemoveMailbox.show();
      }
      else {
        await this.doDeleteGroupWork({distinguishedName: this.groupDetail.distinguishedName});
        this.toastService.success("Successfully deleted group");
        this.$refs.confirmRemoveMailbox.hide()
        this.goToGroupSearch();
      }
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to delete group");
    } finally {
      this.spinnerService.hide();
    }
  }

  async onConfirmRemoveMailbox() {
    this.spinnerService.show();
    try {
      await this.doDeleteGroupWork({distinguishedName: this.groupDetail.distinguishedName,deleteMailbox: true});
      this.toastService.success("Successfully deleted group and associated mailbox");
      this.$refs.confirmRemoveMailbox.hide();
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to delete group");
    } finally {
      this.spinnerService.hide();
    }
  }
  async onConfirmRemoveJustGroup() {
    this.spinnerService.show();
    try {
      await this.doDeleteGroupWork({distinguishedName: this.groupDetail.distinguishedName});
      this.toastService.success("Successfully deleted group");
      this.$refs.confirmRemoveMailbox.hide();
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to delete group");
    } finally {
      this.spinnerService.hide();
    }
  }

  async addToManagerList() {
    this.spinnerService.show();
    try {
      let response = await this.ExchangeToolsService.addAdGroupManager(
        this.groupDetail.distinguishedName,
        this.adUser.distinguishedName
      );
      if (response.status !== false) {
        this.toastService.success(
          `Successfully added manager to ${this.groupDetail.samAccountName}`
        );
      } else {
        window.console.log(response);
        this.toastService.error(
          `Failed to add manager to ${this.groupDetail.samAccountName}`
        );
      }
      await this.loadGroupDetails();
      await this.search();
      this.resetSearch();
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to add manager");
    } finally {
      this.spinnerService.hide();
    }
  }

  async removeMember(entity) {
    this.spinnerService.show();
    try {
      await this.ExchangeToolsService.removeAdGroupManager(
        this.groupDetail.distinguishedName,
        entity.distinguishedName
      );
      await this.loadGroupDetails();
      await this.search();
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to remove user from management list");
    } finally {
      this.spinnerService.hide();
    }
  }
  resetSearch() {
    this.adUser = {};
    this.showAddManager = false;
    this.modelSearch = {
      userId: "",
    };
  }
}
