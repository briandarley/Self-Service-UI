import { BaseValidateMixin } from "./../../../../../components/mixins/index";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "group-managers",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "UserService",
    "ExchangeToolsService",
    "AdGroupService",
    "ValidationService",
  ],
  filters: {
    filterCn: (value) => {
      return value.replace(/\([^)]+\)/, "");
    },
  },
})
export default class GroupMembers extends BaseValidateMixin {
  hideInfo = false;
  _currentCol = "name";
  _currentSortDir = 1;
  dragAndDropCapable = false;
  fileUploadOptions = {};
  isLoaded = false;
  showUpload = false;
  currentUser = {};
  authorizedServiceAccounts = [];
  addMemberResponse = [];
  showAddMember = false;
  
  adEntity = {};
  groupDetail = {
    managedBy: [],
    memberOf: [],
    samAccountName: "",
  };

  groupName = "";
  ouName = "";
  recursive = false;
  pagedResponse = [];
  criteria = {
    
    samAccountName: "",
    //recursiveSearch: false,
    filterText: "",
    pageSize: 50,
    index: 0,
  };
  modelSearch = {
    userId: "",
  };

  @Watch("$route", { deep: true })
  async onRouteChanged() {
    await this.initializeView();
  }

  get isRestrictedGroup() {
    let prefixes = ["MSG_", "MDG_"];
    if (
      prefixes.some((c) =>
        this.groupDetail.samAccountName.toUpperCase().startsWith(c)
      )
    ) {
      return true;
    }
    let suffixes = ["_PSX"];
    if (
      suffixes.some((c) =>
        this.groupDetail.samAccountName.toUpperCase().endsWith(c)
      )
    ) {
      return true;
    }

    return false;
  }

  get canAddMember() {
    if (this.isRestrictedGroup) return false;
    
    if (!this.pagedResponse.totalRecords) {
      return true;
    }
    if (this.showAddMember) {
      return true;
    }

    return false;
  }
  get isSafeGroupForMembers(){
    if(!this.groupDetail.distinguishedName){
      return false;
    }
    if(this.groupDetail.distinguishedName.indexOf("OU=Storage Groups") > -1)
    {
      return true;
    }
    return this.editManagersEnabled;
  }
  get editManagersEnabled() {
    
    if (this.isRestrictedGroup) return false;

    if (!this.currentUser.distinguishedName) {
      return false;
    }
    if (this.groupDetail.isExchangeGroup) {
      return true;
    }
    if (this.groupDetail.distinguishedName.indexOf("OU=Shared Mailboxes") > -1) {
      return true;
    }
    
    //return false;
    let matchedAccounts = this.groupDetail.managedBy.filter(
      (c) =>
        this.currentUser.distinguishedName.toLowerCase() === c.toLowerCase()
    );

    if (matchedAccounts.length) {
      return true;
    }

    //return true;
    matchedAccounts = this.groupDetail.managedBy.filter((c) =>
      this.authorizedServiceAccounts.some((d) => d === c)
    );

    if (matchedAccounts.length) {
      return true;
    }

    //return this.isAdmin;
    return false;
  }

  get isAdmin() {
    return this.UserService.isInRole("ITS_WSP-Access-ITSWS");
  }

  async mounted() {
    this.isLoaded = false;
    this.toastService.set(this);
    await this.initializeView();
    this.fileUploadOptions.fileUpload = this.AdGroupService.uploadAdMemberFiles;
    this.fileUploadOptions.fileUploadProgress = this.fileUploadProgress;
    this.fileUploadOptions.distinguishedName = this.groupDetail.distinguishedName;
    this.fileUploadOptions.samAccountName = this.groupDetail.samAccountName;
    this.fileUploadOptions.downloadTemplate = this.downloadTemplate;
    this.isLoaded = true;
    
  }
  
  async initializeView() {
    this.readQueryParams();

    this.groupDetail = await this.getGroupDetails();
    
    this.groupName = this.groupDetail.samAccountName;

    await this.getAuthorizedServiceAccounts();
    await this.retrieveAuthUserDetails();

    if (this.criteria.samAccountName) {
      await this.search();
    }
  }

  readQueryParams() {
    this.groupName = this.$route.query.name;
    this.ouName = this.$route.query.ouName;
   

    this.criteria.samAccountName = this.$route.query.samAccountName;
    
  }

  async clear() {
    this.criteria = {
      recursiveSearch: this.criteria.recursiveSearch ? true : null,
      filterText: "",
      samAccountName: this.$route.query.samAccountName,
      pageSize: 50,
      index: 0,
    };
    await this.search();
  }

  async getGroupDetails() {
    
    let groupDetailResponse = await this.AdGroupService.getAdGroups({
      samAccountName: this.criteria.samAccountName,
      includeNestedGroups: this.criteria.includeNestedGroups,
    });
    
    return groupDetailResponse.entities[0];
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
    let userId = await this.UserService.getUserName();
    let pagedResponse = await this.ExchangeToolsService.getAdUsers({
      samAccountName: userId,
    });
    this.currentUser = pagedResponse.entities[0];
  }

  async search() {
    this.spinnerService.show();
    try {
      
      let criteria = JSON.parse(JSON.stringify(this.criteria));
      criteria.grpSamAccountName = criteria.samAccountName;
      criteria.samAccountName = "";
      if (criteria.filterText && criteria.filterText.match(/^[0-9]+$/)) {
        criteria.employeeId = criteria.filterText;
      } else if (
        criteria.filterText &&
        this.ValidationService.isValidEmail(criteria.filterText)
      ) {
        criteria.mail = criteria.filterText;
      } else if (criteria.filterText) {
        criteria.samAccountName = criteria.filterText;
      }
      criteria.filterText = "";
      criteria.recursiveSearch = this.criteria.recursiveSearch ? true : null;
      
      
      this.pagedResponse = await this.AdGroupService.getAdGroupMembers(
        criteria
      );
      
      //window.console.log(this.pagedResponse.entities[0])
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
    this.criteria.listSortDirection = this._currentSortDir == 1 ? 1 : 0;

    await this.search();
  }

  async indexChanged(index) {
    this.criteria.index = index;
    await this.search();
  }

  goToGroupSearch(options) {
    if (options && options.parentsOf) {
      this.$router.push({
        name: "ad-groups",
        query: {
          criteria: JSON.stringify({
            userMemberOf: this.groupDetail.samAccountName,
            userMemberOfNested: true,
          }),
        },
      });
      return;
    }

    if(this.$route.query.criteria){
      let criteria = JSON.parse(this.$route.query.criteria);
      delete criteria.samAccountName;
  
      this.$router.push({
        name: "ad-groups",
        query: {
          criteria: JSON.stringify(criteria),
        },
      });
    }
    else {
      this.$router.push({
        name: "ad-groups"
        
      });
    }
    
  }

  goToGroupManagers() {
    let criteria = {};
    if(this.$route.query && this.$route.query.criteria){
      criteria = JSON.parse(this.$route.query.criteria);
    }
   

    this.$router.push({
      name: "ad-group-managers",

      query: {
        samAccountName: this.$route.query.samAccountName,
        criteria: JSON.stringify(criteria),
      },
    });
  }

  async lookupEntity() {
    this.spinnerService.show();
    try {
      let criteria = {};
      

      this.modelSearch.filterText = this.modelSearch.filterText.trim();

      if (this.ValidationService.isValidEmail(this.modelSearch.filterText)) {
        criteria.proxyAddress = this.modelSearch.filterText;
      } else if (this.modelSearch.filterText.match(/^[0-9]+$/)) {
        criteria.employeeId = this.modelSearch.filterText;
      } else if (this.modelSearch.filterText.match(/[a-zA-Z0-9.]+/)) {
        criteria.samAccountName = this.modelSearch.filterText;
      } else {
        this.toastService.error("Invalid criteria entered for manager id");
        return;
      }

      let pagedResponse = await this.ExchangeToolsService.getAdEntities(criteria);
      

      if (pagedResponse.totalRecords !== 0) {
        this.adEntity = pagedResponse.entities[0];
      }
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to find user");
    } finally {
      this.spinnerService.hide();
    }
  }

  clearLookup() {
    this.modelSearch = {};
    this.adEntity = {};
    this.addMemberResponse = [];
  }

  resetSearch() {
    this.modelSearch = {};
    //this.showAddMember = false;
    this.adEntity = {};
    this.addMemberResponse = [];
    this.showUpload = false;
  }
  async removeMember(entity) {
    this.spinnerService.show();
    try {
      let response = await this.AdGroupService.removeAdGroupMember(
        this.groupDetail.samAccountName,
        entity.samAccountName
      );

      //window.console.log(response);
      if (response.success === false) {
        this.toastService.error("Failed to remove member from group");
        return;
      } else {
        this.toastService.success("Successfully removed member from group");
      }
      let index = this.pagedResponse.entities.findIndex(
        (c) => c.samAccountName == entity.samAccountName
      );
      this.pagedResponse.entities.splice(index, 1);
      this.pagedResponse.totalRecords--;

      this.resetSearch();
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to remove entity from group");
    } finally {
      this.spinnerService.hide();
    }
  }

  async addToMemberList() {
    this.spinnerService.show();
    try {
      if (!this.adEntity.cn) {
        this.toastService.error("Invalid member entity");
        return;
      }
      let criteria = {
        userMemberOf: this.adEntity.samAccountName,
        samAccountName: this.groupDetail.samAccountName,
      };
      //check to see if user is already a member of group
      let pagedResponse = await this.AdGroupService.getAdGroups(criteria);
      if (pagedResponse.totalRecords !== 0) {
        this.toastService.error("User is already a member of group");
        return;
      }

      let response = await this.AdGroupService.addAdGroupMember(
        this.groupDetail.samAccountName,
        this.adEntity.samAccountName
      );
      
      if (response.success === false) {
        this.toastService.error("Failed to add member to group");
        return;
      } else {
        this.toastService.success("Successfully added member to group");
      }

      this.pagedResponse.entities.push(this.adEntity);
      this.pagedResponse.totalRecords++;

      //this.resetSearch();

      this.showAddMember = true;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to add member to group");
    } finally {
      this.spinnerService.hide();
    }
  }

  editGroup(entity) {
    //window.console.log(entity);
    let criteria = JSON.parse(JSON.stringify(this.criteria));
    
    this.$router.push({
      name: "ad-group-members",
      query: {
        samAccountName: entity.samAccountName,
        criteria: JSON.stringify(criteria),
      },
      
    });
  }

  
  onShowAddMember() {
    this.showAddMember = true;
    
 //       this.uploadPercentage = parseInt(
    //         Math.round((progressEvent.loaded * 100) / progressEvent.total)
    //       );
  }
  
  fileUploadProgress(progressEvent){
   
    window.console.log(progressEvent);
  }
  onFileUploadBegin(){
    this.spinnerService.show();

  }
  onFileUploadComplete() {
    this.spinnerService.hide();
  }
  onFileUploadedError(response) {
    this.toastService.error(`Failed to upload file, \n${response.message}`)
    
  }
  async onFileUploaded(response) {
    this.toastService.success("File successfully uploaded");
    window.console.log(response);
    let entities = response.map(c=> {
      return { adUser: c.key.entity, status: c.value}
      }
    );

    this.addMemberResponse =  entities;

    await this.search();
    
  }


  showUploadControl() { 
    this.showUpload = true;
  }


  downloadTemplate() {

    let csvContent = "data:text/csv;charset=utf-8,\"Member Id [Onyen - Email - PID - DistinguishedName - SamAccountName]\",\r\n";
    csvContent += "\"Sample Data Follows\",\r\n"
    csvContent += "\"700001234\",\r\n"
    csvContent += "\"70004567\",\r\n"
    csvContent += "\"jdoeonyen\",\r\n"
    csvContent += "\"jdoe@email.unc.edu\",\r\n",
    csvContent += "\"CN=Charles Test Xavier,OU=Contacts,OU=Identity,DC=adtest,DC=unc,DC=edu\",\r\n"
    
    var encodedUri = encodeURI(csvContent);
    const $ = this.$;

    let link = $("<a></a>")
        .attr("href", encodedUri)
        .attr("download", `add-member-to-group-template.csv`)
    
    $("body").append(link);
    $(link)[0].click()
    $(link).remove();

    

    

  }
}
