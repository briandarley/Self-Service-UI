import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'create-request',
    dependencies: ['$','moment','toastService','spinnerService'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class CreateRequest extends Vue {
  async mounted() { 
    this.toastService.set(this);
  }
  async created(){
     //called before child views are mounted
  }
}

