import Vue from "vue"
import { Component } from "vue-property-decorator";


@Component({
    name: 'home',
    dependencies: ['$','toastService','spinnerService'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

  export default class Home extends Vue {
    click(){
      //this.spinnerService.show();
      //setTimeout(() => {
      //  this.spinnerService.hide();
      //}, 15000);

      //this.$refs.confirmTest.show();
      //this.toastService.success("test")
    }
    
    async mounted() {
      this.toastService.set(this);
  }
}


