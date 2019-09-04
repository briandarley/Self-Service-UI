import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'change-list-owner',
    dependencies: ['ScreenReaderAnnouncerService'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class ChangeListOwner extends Vue {
  async mounted() { 
    //child views are 'mounted' before parent is 'mounted' 
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Change List Owner");
  }
  
}

