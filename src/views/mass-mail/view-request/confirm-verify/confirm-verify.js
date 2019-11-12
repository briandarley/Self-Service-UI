import Vue from "vue"
import {
  Component,Watch
} from "vue-property-decorator";

@Component({
  name: 'confirm-verify',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'MassMailService'],
  props: ['campaign']
})
export default class ConfirmVerify extends Vue {
  onyen = null;
  verified = false;
  searched = false;
  @Watch("onyen", {immediate:false})
  onOnyenChanged(){
    this.verified = false;
    this.searched = false;
  }
  get hasVerified() {
    if (this.onyen === null) {
      return false;
    }
    if (!this.searched) {
      return false;
    }
    return true;

  }
  async search() {
    try {
      this.spinnerService.show();
      var response = await this.MassMailService.verifyCampaignReceipt(this.campaign.id, this.onyen);
      this.verified = response;
      if(this.verified){
        this.toastService.success("Successfully located matching email");
      }
      else{
        this.toastService.warn("Failed to locate matching email");
      }

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to lookup');
    } finally {
      this.searched = true;
      this.spinnerService.hide();
    }
  }

  clear() {
    this.onyen = null;
    this.searched = false;
  }
  async mounted() {
    this.toastService.set(this);
  }

}