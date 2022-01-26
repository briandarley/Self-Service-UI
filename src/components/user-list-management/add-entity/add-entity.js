import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "add-entity",
  dependencies: ["$", "moment", "toastService", "spinnerService"],
  props: ["service", "group"],
})
export default class AddEntity extends Vue {
  criteria = {
    filterText: "",
    pageSize: 10,
    index: 0,
  };
  pagedResponse = {};

  async mounted() {
    this.toastService.set(this);
  }
  async indexChanged(index) {
    this.spinnerService.show();
    try {
      this.criteria.index = index;
      let pagedResponse = await this.service.getPagedAdEntities(this.criteria);
      this.pagedResponse = pagedResponse;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to lookup records");
    } finally {
      this.spinnerService.hide();
    }
  }
  async onLookupEntity() {
    this.spinnerService.show();
    try {
      this.pagedResponse = {};




      let pagedResponse = await this.service.getPagedAdEntities(this.criteria);

      if (pagedResponse.totalRecords == 0) {
        this.toastService.error("No records found matching crieria");
        return;
      }
      this.pagedResponse = pagedResponse;

      this.showDialog();
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Error for user");
    } finally {
      this.spinnerService.hide();
    }
  }

  onClear() {
    this.criteria.filterText = "";
    this.pagedResponse = {};
  }

  async addEntity(entity) {
    this.spinnerService.show();
    try {
      
      
      let pagedResponse = await this.service.getMyManagedGroupMembers({
        groupSamAccountName: this.group.samAccountName, 
        samAccountName: entity.samAccountName});
      
      if(pagedResponse.totalRecords !== 0) {
        this.toastService.error("Entity already a member of group");
        return;
      }
      entity.added = true;

      this.pagedResponse =JSON.parse(JSON.stringify(this.pagedResponse));
      this.$emit("addToGroupMembers", entity)

      
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Error adding entity to group");
    } finally {
      this.spinnerService.hide();
    }
  }

  

  onCancelAddEntityClick() {
    this.onClear();
    this.hideDialog();
  }

  showDialog() {
    if (!this.$refs.confirmAddEntity) return;
    this.$refs.confirmAddEntity.show();
  }
  hideDialog() {
    if (!this.$refs.confirmAddEntity) return;
    this.$refs.confirmAddEntity.hide();
  }
}
