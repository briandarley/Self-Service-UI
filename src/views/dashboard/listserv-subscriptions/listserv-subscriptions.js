import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";
//import SimpleBar from "simplebar"; // or "import SimpleBar from 'simplebar';" if you want to use it manually.

@Component({
  name: 'listserv-subscriptions',
  dependencies: ['$', '_', 'spinnerService', 'toastService', 'ListManagerService'],
  components: {}

})

export default class ListservSubscriptions extends Vue {
  userSubscriptions = [];
  selectedEmail = "";
  selectedList = [];
  uniqueEmails = [];

  @Watch('selectedEmail')
  async onSelectedEmail(newValue) {
    if (!newValue) return;
    await this.bindList();
  }

  async getUniqueEmailsFromList() {
    let _ = this._;

    let groups = Object.keys(_.groupBy(this.userSubscriptions, "email"));
    return groups;


  }
  async bindList() {
    this.selectedList = this.userSubscriptions.filter(c => c.emailAddress === this.selectedEmail).sort((a, b) => {
      let item1 = a.listName.toLowerCase();
      let item2 = b.listName.toLowerCase();

      if (item1 < item2) return -1;
      if (item2 > item1) return 1;
      return 0;

    });
  }

  async loadMySubscriptions() {

    try {
      this.spinnerService.show();

      let userSubscriptions = await this.ListManagerService.getMySubscriptions();
      userSubscriptions.map(c => {
        c.name = c.listName;
        c.email = c.emailAddress;
        return c;
      });

      this.userSubscriptions = userSubscriptions;
      this.uniqueEmails = await this.getUniqueEmailsFromList();
      this.selectedEmail = this.uniqueEmails[0];
    } catch (e) {
      this.toastService.error("An error occurred retrieving lyris lists");
      window.console.log(e);
    } finally {
      this.spinnerService.hide();
    }

  }

  async mounted() {
    this.toastService.set(this);
    this.loadMySubscriptions();

  }

}