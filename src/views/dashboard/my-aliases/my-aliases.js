import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'my-aliases',
    dependencies: ['$','spinnerService', 'toastService','LdapService'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class MyAliases extends Vue {
  model = {
    email: ""
  };
  async save(){
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
      this.toastService.success("Successfully updated alias");
    }, 1000);
  }

  async mounted() {
    this.toastService.set(this);
    this.spinnerService.show();
       
    let userProfile = await this.LdapService.getUseProfile();
    
    this.model.email =  userProfile.mail;
    this.spinnerService.hide();

  }
  async created(){
     //called before child views are mounted
  }
}

