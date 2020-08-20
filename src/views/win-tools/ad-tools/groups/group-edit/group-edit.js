import { BaseValidateMixin } from "./../../../../../components/mixins/index";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "group-edit",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "ValidationService"
  ],
  filters: {
    filterCn : (value)=> {
      return value.replace(/\([^)]+\)/,"");
    }
  }
})
export default class GroupEdit extends BaseValidateMixin {
  _currentCol = "name";
  _currentSortDir = 1;


  groupName = "";
  ouName = "";
  recursive = false;
  pagedResponse = [];
  criteria = {
    distinguishedName: "",
    recursiveSearch: true,
    filterText: "",
    pageSize: 50,
    index: 0
  };

  async mounted() {
    this.toastService.set(this);

    this.groupName = this.$route.query.name;
    this.ouName = this.$route.query.ouName;
    this.criteria.distinguishedName = this.$route.query.distinguishedName;

    if (this.criteria.distinguishedName) {
      await this.search();
    }
  }

 
  async clear() {
    this.criteria = {
      
      recursiveSearch: false,
      filterText: "",
      distinguishedName : this.$route.query.distinguishedName,
      pageSize: 50,
      index: 0

    }
    await this.search();
  }

  async search() {
    this.spinnerService.show();
    try {

      let criteria = JSON.parse(JSON.stringify(this.criteria));
      if(criteria.filterText && criteria.filterText.match(/^[0-9]+$/)) {
        criteria.employeeId = criteria.filterText;
        
      } else if(criteria.filterText && this.ValidationService.isValidEmail(criteria.filterText)) {
        criteria.mail = criteria.filterText;
        
      } else if(criteria.filterText ) {
        criteria.samAccountName = criteria.filterText;
      }
      criteria.filterText = "";

      this.groupDetailResponse = await this.ExchangeToolsService.getAdGroups({distinguishedName: this.criteria.distinguishedName});
      this.groupName = this.groupDetailResponse.entities[0].samAccountName;
      this.pagedResponse = await this.ExchangeToolsService.getAdGroupMembers(
        criteria
      );
      //window.console.log(this.pagedResponse.entities[0])
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to load AD members");
    }
    finally {
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
  async indexChanged(index) {
    this.criteria.index = index;
    await this.search();
  }

  goToGroupSearch() {
    this.$router.push({
      name: "ad-groups",
      query: {
        criteria: this.$route.query.criteria,
      },
    });
  }
  goToGroupManagers() {
    this.$router.push({
      name: "ad-group-managers",
      // params: {
      //   id: this.$route.params.id
      // },
      query: {
        distinguishedName: this.$route.query.distinguishedName,
        criteria: JSON.stringify(this.criteria)
      },
      
      
    });

  }
}
