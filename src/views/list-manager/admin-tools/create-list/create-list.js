import Vue from "vue";
import { Component } from "vue-property-decorator";
import TabCreateNew from "./tab-create-new.vue";
import TabReinstate from "./tab-reinstate.vue";
@Component({
  name: "create-list",
  dependencies: [
    "$",
    "_",
    "toastService",
    "spinnerService",
    "ListManagerService",
    "ScreenReaderAnnouncerService"
  ],
  components: { TabCreateNew, TabReinstate }
})
export default class CreateList extends Vue {
  certify = false;
  emailAddresses = [];
  adminEmails = [];
  dormantList = [];
  async getAdminEmailAddresses() {
    try {
      this.emailAddresses = await this.ListManagerService.getEmailAddresses();
      if (!this.emailAddresses.length) {
        this.toastService.error("Failed to retrieve email addresses");
      }
    } catch (e) {
      this.toastService.error("Failed to retrieve email addresses");
    }
  }
  async getSubscribedLists() {
    const _ = this._;
    let subsciptions = await this.ListManagerService.getMySubscriptions();
    if (subsciptions.length) {
      subsciptions = subsciptions.filter(c => c.isListAdmin);
    }

    this.adminEmails = _(subsciptions)
      .groupBy("emailAddress")
      .map(c => c.emailAddress)
      .value();
  }
  async getDormantLists() {
    if(!this.emailAddresses.length) return;

    let response = await this.ListManagerService.getDormantLists(this.emailAddresses[0]);
    
    this.dormantList =  response;

    
  }
  //getMySubscriptions
  async mounted() {
    this.toastService.set(this);
    this.spinnerService.show();
    try {
      await Promise.all([
        this.getAdminEmailAddresses(),
        this.getSubscribedLists()
      ]);
      await this.getDormantLists();
      this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Create List");
    } catch (e) {
      window.console.log(e)
      this.toastService.error("Failed to initialize component");
    }
    finally{
      this.spinnerService.hide();
    }
  }
 
}
