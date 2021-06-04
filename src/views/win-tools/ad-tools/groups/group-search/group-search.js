import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "group-search",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "UserService",
  ],
  components: {},
})
export default class GroupSearch extends Vue {
  hideInfo = false;
  _currentCol = "name";
  _currentSortDir = 1;
  authorizedServiceAccounts = [];
  currentUser = {};
  thDataOptions = {
    name: "query-results",
    source: this.typeAheadSource,
    async: false,
    displayKey: "name",
    display: this.getTypeAheadDisplay,
    limit: 20,
  };

  pagedResponse = {
    totalRecords: 0,
    entities: [],
  };

  criteria = {
    ouName: "",
    filterText: "",
    pageSize: 50,
    index: 0,
    managedBy: "",
    //memberGroupCountGreaterThan: 10
  };
  criteriaOrganizationalUnits = {
    index: 0,
    pageSize : 100,
    sort: "name",
    isRootOu: true,
  }
  organizationalUnits = [];

  async mounted() {
    this.toastService.set(this);
    await this.getAuthorizedServiceAccounts();
    await this.retrieveAuthUserDetails();
    await this.loadOrganizationalUnits();
    await this.readQueryParams();
  }

  async loadOrganizationalUnits() {
    let result = await this.ExchangeToolsService.getOrganizationalUnits(this.criteriaOrganizationalUnits);

    this.organizationalUnits = result.entities;
  }

  initializeTypeAheadValue() {
    this.$refs.thSelectDepartment.initializeControl();

    let ouItem = this.organizationalUnits.find(
      (c) => c.name == this.criteria.ouName
    );
    if (ouItem) {
      this.setTypeAheadValue(this.getTypeAheadDisplay(ouItem));
    }
  }

  setTypeAheadValue(value) {
    this.$refs.thSelectDepartment.setValue(value);
  }

  typeAheadSource(query, process) {
    //Take property value, split based on words, then return true if the filter matches the start of the word
    let filterValue = (entity, property) => {
      if (entity[property]) {
        let words = entity[property].toUpperCase().split(" ");
        if (words.some((c) => c.startsWith(filter))) {
          return true;
        }
        //return entity[property].toUpperCase().indexOf(filter) > -1;
      }
      return false;
    };

    let filter = query.toUpperCase();
    
    let items = this.organizationalUnits
      .filter(
        (c) =>
          filterValue(c, "name") ||
          filterValue(c, "department") ||
          filterValue(c, "description")
      )
      .sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) {
          return -1;
        }
        if (a.name.toLowerCase() > b.name.toLowerCase()) {
          return 1;
        }
        return 0;
      });

    process(items);
  }

  getTypeAheadDisplay(item) {
    return item.name + " - " + item.department;
  }

  getTypeAheadValue(display) {
    let result = this.organizationalUnits.find(
      (c) => c.name + " - " + c.department === display
    );
    return result;
  }

  onDepartmentalUnitChange(value) {
    //validate selection, esure what was selected/entered matches to what is available in the list
    //if valid set the model value, otherwise clear the typeahead
    let isValid = true;

    let stringValue = "";
    if (typeof value !== "object") {
      stringValue = value;
      isValid = this.organizationalUnits.some(
        (c) => this.getTypeAheadDisplay(c) === value || c.name === value
      );
    }
    if (isValid) {
      if (!stringValue) {
        stringValue = value.name;
      }
      this.criteria.ouName = this.organizationalUnits.find(
        (c) =>
          this.getTypeAheadDisplay(c) === stringValue || c.name === stringValue
      ).name;
      //this.model.ouName = stringValue;
      this.setTypeAheadValue(this.criteria.ouName);
    } else {
      //this.toastService.error("Invalid Department Unit");
      this.setTypeAheadValue(null);
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

  clear() {
    this.criteria = {
      department: "",
      index: 0,
      pageSize: 50
    };
    this.setTypeAheadValue(null);

    this.pagedResponse = {
      totalRecords: 0,
      entities: [],
    };

    this.$router.push({
      name: "ad-groups",
    });
  }

  async manageMembers(entity) {
    //let ouName

    this.$router.push({
      name: "ad-group-members",
      query: {
        distinguishedName: entity.distinguishedName,
        criteria: JSON.stringify(this.criteria),
      },
      // params: {
      //   name: result.name,
      //   ouName: result.ouName
      // }
    });
  }

  async manageManagers(entity) {
    //let ouName

    this.$router.push({
      name: "ad-group-managers",
      query: {
        distinguishedName: entity.distinguishedName,
        criteria: JSON.stringify(this.criteria),
      },
      // params: {
      //   name: result.name,
      //   ouName: result.ouName
      // }
    });
  }

  async createNewGroup() {
    this.$router.push({
      name: "ad-group-create",
      // params: {
      //   id: response.id
      // }
    });
  }

  async indexChanged(index) {
    this.criteria.index = index;
    await this.search();
  }

  async search(event) {
    if (event) {
      this.criteria.index = 0;
    }
    this.spinnerService.show();
    try {
      if (this.criteria.ouName) {
        this.criteria.prefixName = this.criteria.ouName + "_";
      }

      let pagedResponse = await this.ExchangeToolsService.getAdGroups(
        this.criteria
      );


      if (pagedResponse.totalRecords === 0) {
        this.toastService.warn("No records match entered criteria");
      }

      //pagedResponse = JSON.parse(JSON.stringify(pagedResponse));

      this.pagedResponse = pagedResponse;
      
      
    } catch (e) {
      window.console.log(e);
    } finally {
      this.spinnerService.hide();
    }
  }

  async readQueryParams() {
    if (this.$route.query.criteria) {
      this.criteria = JSON.parse(this.$route.query.criteria);

      this.setTypeAheadValue(this.criteria.ouName);
      if (
        this.criteria.ouName ||
        this.criteria.managedBy ||
        this.criteria.userMemberOf ||
        this.criteria.filterText
      ) {
        await this.search();
      }
    }
  }

  async getAuthorizedServiceAccounts() {
    this.authorizedServiceAccounts = [];

    let autorizedServiceAccounts = await this.ExchangeToolsService.getAuthorizedServiceAccounts();

    for (var i = 0; i < autorizedServiceAccounts.length; i++) {
      let pagedResponse = await this.ExchangeToolsService.getAdUsers({
        samAccountName: autorizedServiceAccounts[i].samAccountName,
      });

      let account = pagedResponse.entities[0];

      this.authorizedServiceAccounts.push(account.distinguishedName);
    }
  }

  async retrieveAuthUserDetails() {
    let userId = this.UserService.getUserName();

    let pagedResponse = await this.ExchangeToolsService.getAdUsers({
      samAccountName: userId,
    });

    this.currentUser = pagedResponse.entities[0];
  }

  get isAdmin() {
    return this.UserService.isInRole("ITS_WSP-Access-ITSWS");
  }

  editManagersEnabled(group) {
    if (!group) return false;
    // "distinguishedName": "CN=ITS_SharedMailbox3 mailbox full access,OU=Shared Mailboxes,OU=Departmental Users,OU=ITS,OU=UNC,DC=adtest,DC=unc,DC=edu",
    //"distinguishedName": "CN=ITS_TestResourceMailbox mailbox full access,OU=Resource Mailboxes,OU=Departmental Users,OU=ITS,OU=UNC,DC=adtest,DC=unc,DC=edu",
    if (this.isRestrictedGroup(group)) {
      return false;
    }
    if(group.isExchangeGroup) {
      return true;
    }
    if(group.distinguishedName.indexOf("OU=Shared Mailboxes") > -1) {
      return true;
    }
    if (!group.managedBy.length) {
      return false;
    }

    if (!this.currentUser.distinguishedName) {
      return false;
    }

    let matchedAccounts = group.managedBy.filter(
      (c) =>
        this.currentUser.distinguishedName.toLowerCase() === c.toLowerCase()
    );

    if (matchedAccounts.length) {
      return true;
    }

    matchedAccounts = group.managedBy.filter((c) =>
      this.authorizedServiceAccounts.some((d) => d === c)
    );

    return matchedAccounts.length;
  }

  isRestrictedGroup(group) {
    let prefixes = ["MSG_", "MDG_"];
    if (
      prefixes.some((c) => group.samAccountName.toUpperCase().startsWith(c))
    ) {
      return true;
    }
    let suffixes = ["_PSX"];
    if (suffixes.some((c) => group.samAccountName.toUpperCase().endsWith(c))) {
      return true;
    }

    return false;
  }
}
