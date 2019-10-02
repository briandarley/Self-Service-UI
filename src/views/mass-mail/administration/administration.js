import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";
//import HelpDeskRoleManagement from './help-desk-role-management/help-desk-role-management.vue';
import HelpDeskRoleManagement from '../../administration/help-desk-access/help-desk-role-management/help-desk-role-management.vue';
@Component({
    name: 'administration',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService'],
    components: { HelpDeskRoleManagement}
  })
export default class Administration extends Vue {
  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Administration");
  }
  
}

