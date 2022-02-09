import {
  BaseValidateMixin
} from "../../../components/mixins/index";

import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'mfa-reset',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'DashboardService','ScreenReaderAnnouncerService','DuoAuthService']

})

export default class MfaReset extends BaseValidateMixin {
  
  resetEnabled = true;
  
  async mounted() {
    this.toastService.set(this);

    this.resetEnabled = await this.hasAuthMethod();

    if (this.DuoAuthService.getDuoState() === "STATE_AUTH_PASSED") {
      this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Duo authentication successful, MFA reset for Office 365");
    }
       

  
  }
  
  async hasAuthMethod(){
    try {
       
  
      let request = await this.DashboardService.getAuthMethods();
      
      
      if(!request) return false;
      if(!request.value) return false;
      
      return request.value.some(c=> c.methodType === "PhoneAuth" || c.methodType === "Authenticator")

      
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to reset MFA status for user");
    } finally {
      this.spinnerService.hide();
    }
  }

  async resetMfa() {
    
    this.spinnerService.show();
    try {
      
      await this.DashboardService.toggleMfa();
      this.resetEnabled = false;

      this.toastService.success("Successfully reset MFA for account");
    } catch (e) {
      this.toastService.error("Failed to reset MFA status for user");
    } finally {
      this.spinnerService.hide();
    }
  }
  
  
}