import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'mfa-modify-account',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService']
})

export default class MfaModifyAccount extends Vue {
  filter = "";
  mfaAccountStatus = null;
  get label(){
    if(!this.mfaAccountStatus) return "";
    if(this.mfaAccountStatus.mfaEnabled) return "Enabled";
    return "Disabled";
  }
  async mounted() {
    this.toastService.set(this);
  }
  mfaStatusChanged(newValue){
    if(!this.mfaAccountStatus) return;
    this.mfaAccountStatus.mfaEnabled = newValue;
  }
  async search() {
    this.mfaAccountStatus  = null;
    this.spinnerService.show();
    try {
      this.mfaAccountStatus = await this.ExchangeToolsService.getMfaAccountStatus(this.filter);
      window.console.log(this.mfaAccountStatus );

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve MFA account status");
    } finally {
      this.spinnerService.hide();
    }

  }
  clear() {
    this.filter = "";
    this.mfaAccountStatus  = null;
  }
}