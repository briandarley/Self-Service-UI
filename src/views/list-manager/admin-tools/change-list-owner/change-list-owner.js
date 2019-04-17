import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'change-list-owner',
    dependencies: ['$','moment'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class ChangeListOwner extends Vue {
  async mounted() { 
    //child views are 'mounted' before parent is 'mounted' 
  }
  async created(){
     //called before child views are mounted
  }
}

