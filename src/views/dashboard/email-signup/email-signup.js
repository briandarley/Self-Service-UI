//import Vue from "vue"
import {
  Component
} from "vue-property-decorator";
import {
  mixins,
  BaseValidateMixin
} from "../../../components/mixins/index";

@Component({
  name: 'email-signup',
  dependencies: ['$', 'moment', 'spinnerService', 'toastService', 'ProvisioningService', 'LdapService'],
  components: {}
  //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
})
export default class EmailSignup extends mixins(BaseValidateMixin) {
  showProgress = false;
  provisionInfo = {};
  userProfile = {};
  model = {
    mail: ""
  }

  clear() {
    this.model.mail = "";
    this.clearValidation();
  }
  async click() {

    let errors = this.validate();
    this.toastService.error(errors.join("<br/>"));

  }

  async mounted() {
    this.toastService.set(this);
    this.spinnerService.show();
    this.provisionInfo = await this.ProvisioningService.getProvisioningStatus();  
    let userProfile = await this.LdapService.getUseProfile();
    
    this.model.email = userProfile.mail;
    this.spinnerService.hide();

  }
  async created() {
    //called before child views are mounted






  }
}