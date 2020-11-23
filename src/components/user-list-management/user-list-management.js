import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import Spinner from "@/components/spinner/spinner.vue";
import AddEntity from "./add-entity/add-entity.vue";

@Component({
  name: "user-list-management",
  dependencies: ["$", "moment", "toastService", "spinnerService"],
  components: {
    Spinner,
    AddEntity,
  },
  props: ["group", "headerLabels", "autoLoadEntities", "service"],
})
export default class UserListManagement extends Vue {
  userId = "";
  _currentCol = "samAccountName";
  _currentSortDir = 1;
  //originalList = [];
  filter = {};
  //entities = [];
  pagedResponse = {};
  criteria = {
    index: 0,
    pageSize: 10,
    sort: "samAccountName"
  };

  //Called from parent controller
  async populateEntities(parentGroup) {}

  async indexChanged(index) {
    this.criteria.index = index;
    await this.search();
  }
  filteringCall;

  @Watch("filter", {
    immediate: false,
    deep: true,
  })
  onFilterChanged(newValue) {
    this.criteria.index = 0;
    this.criteria.samAccountName = "";
    this.criteria.mail = "";
    this.criteria.name = "";
    this.criteria.filterText = "";
    if(this.filter.samAccountName) {
      //this.criteria.samAccountName = this.filter.samAccountName;
      this.criteria.filterText = this.filter.samAccountName;
    }
    if(this.filter.mail) {
      this.criteria.mail = this.filter.mail;
    }
    if(this.filter.name){
      this.criteria.name = this.filter.name;
    }
    
    if(this.filteringCall)
    clearTimeout(this.filteringCall)

    this.filteringCall = setTimeout(async ()=> {
      await this.search();
    }, 1000);

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
  async search() {
    try {
      this.showSpinner();

      let pagedResponse = await this.service.getMyManagedGroupMembers(
        this.criteria
      );

      this.pagedResponse = pagedResponse;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve members entities");
    } finally {
      this.hideSpinner();
    }
  }
  async mounted() {
    this.toastService.set(this);
    this.$emit("controlLoaded");
    if (this.autoLoadEntities) {
      this.criteria.groupSamAccountName = this.group.samAccountName;

      await this.search();
    }
  }

  async onAddToGroupMembers(entity) {
    this.spinnerService.show();
    try {
      let response = await this.service.addMemberToGroup(
        this.group.distinguishedName,
        entity.distinguishedName
      );

      if (response.status === false) {
        this.toastService.error(response.message);
        return;
      }
      this.pagedResponse.entities.push(entity);

      this.toastService.success(`Successfully added member ${entity.cn}`);
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Error for user");
    } finally {
      this.spinnerService.hide();
    }
  }

  async removeEntity(entity) {
    try {
      this.showSpinner();

      let response = await this.service.removeGroupMemberFromGroup(
        this.group.distinguishedName,
        entity.distinguishedName
      );

      if (response.status === false) {
        this.toastService.error(
          `Failed to remove entity from group, ${response.message}`
        );
        return;
      }

      let index = this.pagedResponse.entities.findIndex(
        (c) => c.distinguishedName == entity.distinguishedName
      );

      this.pagedResponse.entities.splice(index, 1);
      this.pagedResponse.entities = JSON.parse(JSON.stringify(this.entities));

      this.toastService.success("Successfully removed entity");
      this.$emit("entityRemoved", entity);
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to remove entity");
    } finally {
      this.hideSpinner();
    }
  }

  showSpinner() {
    if (!this.$refs.spinnerMmbrList) return;
    this.$refs.spinnerMmbrList.showSpinner();
  }

  hideSpinner() {
    if (!this.$refs.spinnerMmbrList) return;
    this.$refs.spinnerMmbrList.hideSpinner();
  }

  toggleSpinner() {
    if (!this.$refs.spinner) return;
    this.$refs.spinner.toggleSpinner();
  }
}
