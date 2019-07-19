import Vue from "vue"
import { Component } from "vue-property-decorator";
import HelpDeskRoleManagement from './help-desk-role-management/help-desk-role-management.vue';
@Component({
    name: 'help-desk-access',
    dependencies: ['$','moment','toastService','spinnerService','AdministrationService'],
    components:{HelpDeskRoleManagement}
  })

export default class HelpDeskAccess extends Vue {
  
  
  async mounted() { 
    this.toastService.set(this);


  }
  
}

