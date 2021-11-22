import {
  BaseValidateMixin
} from "../../../components/mixins/index";

import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'mfa-reset',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'DashboardService','ScreenReaderAnnouncerService']

})

export default class MfaReset extends BaseValidateMixin {
  
  
  async mounted() {
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Dashboard - MFA Reset");

  
  }
  
  async resetMfa() {
    
    this.spinnerService.show();
    try {
      
      await this.DashboardService.toggleMfa();

      this.toastService.success("Successfully reset MFA for selected account");
    } catch (e) {
      this.toastService.error("Failed to reset MFA status for user");
    } finally {
      this.spinnerService.hide();
    }
  }
  
  
}