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
    "ListManagerService"
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
    let dormantList = [];
    let emailAddresses = this.emailAddresses;
    //emailAddresses = ["elizabeth_steadman@med.unc.edu", "werica@email.unc.edu"];

    for (var i = 0; i < emailAddresses.length; i++) {
      let email = emailAddresses[i];
      let response = await this.ListManagerService.getDormantLists(email);

      dormantList.concat(response);
    }
    this.dormantList = dormantList;
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
    } catch (e) {
      window.console.log(e)
      this.toastService.error("Failed to initialize component");
    }
    finally{
      this.spinnerService.hide();
    }
  }
 
}
