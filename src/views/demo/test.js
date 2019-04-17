import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'test',
    dependencies: ['$'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class Test extends Vue {
  async mounted() {
    
  }
}

