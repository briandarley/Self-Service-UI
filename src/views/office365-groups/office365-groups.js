import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'office365-groups',
    dependencies: ['$','moment'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class Office365Groups extends Vue {
  async mounted() { 
    //child views are 'mounted' before parent is 'mounted' 
  }
  async created(){
     //called before child views are mounted
  }
}

