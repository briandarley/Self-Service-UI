import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "delete-list",
  dependencies: ["$", "toastService", "spinnerService", "ListManagerService"]
})
export default class DeleteList extends Vue {
  adminList = [];
  selectedList = null;
  async mounted() {
    this.toastService.set(this);
    this.spinnerService.show();
    try {
      let myEmails = await this.ListManagerService.getEmailAddresses();
      let queryList = [];
      let list = [];
      for (let i = 0; i < myEmails.length; i++) {
        queryList.push(this.ListManagerService.getMyOwnedLists(myEmails[i]));
      }
      let values = await Promise.all(queryList)
      for (let i = 0; i < values.length; i++) {
        list = list.concat(values[i]);
      }
      this.adminList = list;
      
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to initialize component");
    } finally {
      this.spinnerService.hide();
    }
  }
}
