import { BaseValidateMixin } from "./../../../../../components/mixins/index";
import { Component } from "vue-property-decorator";

@Component({
  name: "group-edit",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "AdGroupService",
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
    samAccountName: "",
    recursiveSearch: true,
    filterText: "",
    pageSize: 50,
    index: 0
  };

  async mounted() {
    this.toastService.set(this);

    this.groupName = this.$route.query.name;
    this.ouName = this.$route.query.ouName;
    this.criteria.samAccountName = this.$route.query.samAccountName;

    if (this.criteria.samAccountName) {
      await this.search();
    }
  }

 
  async clear() {
    this.criteria = {
      
      recursiveSearch: false,
      filterText: "",
      samAccountName : this.$route.query.samAccountName,
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

      this.groupDetailResponse = await this.AdGroupService.getAdGroups({samAccountName: this.criteria.samAccountName});
      this.groupName = this.groupDetailResponse.entities[0].samAccountName;
      this.pagedResponse = await this.AdGroupService.getAdGroupMembers(
        criteria
      );
      
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
        samAccountName: this.$route.query.samAccountName,
        criteria: JSON.stringify(this.criteria)
      },
      
      
    });

  }
}
