import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'provision-status',
    dependencies: ['$','moment','toastService','spinnerService'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class ProvisionStatus extends Vue {
  provisionSelection = "1";

  async mounted() { 
    this.toastService.set(this);
  }
  
}

