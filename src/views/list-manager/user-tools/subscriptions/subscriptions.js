import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'subscriptions',
    dependencies: ['$','toastService','spinnerService','ListManagerService','ScreenReaderAnnouncerService'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class Subscriptions extends Vue {
  userSubscriptions =[];

  
  

  async loadMySubscriptions(){
    this.spinnerService.show();
    try {
      //child views are 'mounted' before parent is 'mounted' 
      let userSubscriptions = await this.ListManagerService.getMySubscriptions();
      userSubscriptions.map(c => {
        c.name = c.listName;
        c.email = c.emailAddress;
        return c;
      });

      this.userSubscriptions = userSubscriptions;
      
    } catch (e) {
      this.toastService.error("An error occurred retrieving lyris lists");
      window.console.log(e);
    }
    this.spinnerService.hide();
    
  }

  async mounted() {
    this.toastService.set(this);
    await this.loadMySubscriptions();
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Lyris Subscriptions");
  }

}

