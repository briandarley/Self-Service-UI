import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'mfa-reset',
    dependencies: ['$','moment','toastService','spinnerService'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class MfaReset extends Vue {
  filter = "";
  async mounted() { 
    this.toastService.set(this);
  }
  search(){

  }
  clear(){
    
  }
}

