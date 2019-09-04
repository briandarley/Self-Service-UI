import Vue from "vue";
import {
  Component
} from "vue-property-decorator";

@Component({
  name: "delete-list",
  dependencies: ["$", "toastService", "spinnerService", "ListManagerService","ScreenReaderAnnouncerService"]
})
export default class DeleteList extends Vue {
  adminList = [];
  selectedList = null;
  async mounted() {
    this.toastService.set(this);
    await this.loadListDropDown();
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Delete Lyris List");
  }
  async loadListDropDown() {

    try {
      this.spinnerService.show();
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
  async deleteList() {
    if (!this.selectedList) {
      this.toastService.error("Select a list to remove");
      return;
    }
    try {
      this.spinnerService.show();
      this.ListManagerService.deleteList({
        listName: this.selectedList
      });
      await this.loadListDropDown();
      this.toastService.success("Successfully removed list");

    } catch (e) {
      window.console.log(e);
      this.toastService.error('');
    } finally {
      this.spinnerService.hide();
    }
  }
}