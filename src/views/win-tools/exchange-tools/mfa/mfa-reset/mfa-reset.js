import {
  BaseValidateMixin
} from "../../../../../components/mixins/index";

import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'mfa-reset',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService','ScreenReaderAnnouncerService']

})

export default class MfaReset extends BaseValidateMixin {
  filter = "";
  mfaMethodType = null;
  get currentStatus() {
    if (!this.mfaMethodType) {
      return "";
    }
    
    if (this.mfaMethodType.newStatus) {
      return this.mfaMethodType.newStatus;
    }
    return this.mfaMethodType.status;
  }
  get showContactMethod(){
    if(!this.mfaMethodType ) return false;
    if(!this.mfaMethodType.phoneNumber && !this.mfaMethodType.deviceName && !this.mfaMethodType.methodType ){
      return false;
    }
    return true;
  }
  async mounted() {
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Exchange Tools - MFA Reset");
  }
  async search() {
    let errors = this.validate(this.$refs.searchForm);
    if (errors.length) {
      this.toastService.error("Validation Failed");
      return false;
    }



    this.spinnerService.show();
    try {
      this.mfaMethodType = await this.ExchangeToolsService.getMfaMethodType(this.filter);

      if (this.mfaMethodType.status === false) {
        this.mfaMethodType = null;
        this.toastService.error("Failed to retrieve status for user");
      }
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve MFA status for user");
    } finally {
      this.spinnerService.hide();
    }
  }
  async resetMfa() {
    
    this.spinnerService.show();
    try {
      
      await this.ExchangeToolsService.toggleMfa(this.mfaMethodType.onyen);

      this.toastService.success("Successfully reset MFA for selected account");
    } catch (e) {
      this.toastService.error("Failed to reset MFA status for user");
    } finally {
      this.spinnerService.hide();
    }
  }

  clear() {
    this.filter = "";
    this.mfaMethodType = null;
  }
}