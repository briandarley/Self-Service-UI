import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'mass-mail',
    dependencies: ['$','moment'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class MassMail extends Vue {
  async mounted() { 
    //child views are 'mounted' before parent is 'mounted' 
  }
  async created(){
     //called before child views are mounted
  }
}

