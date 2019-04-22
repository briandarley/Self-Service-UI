// eslint-disable-next-line
import Vue from "vue"
import {
  Component
} from "vue-property-decorator";
import {
  BaseValidateMixin
} from "../../../../../components/mixins/index";
@Component({
  name: 'mfa-modify-account',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService']
})

export default class MfaModifyAccount extends BaseValidateMixin {
  filter = "";
  mfaAccountStatus = null;
  showConfirm7day = false;
  showConfirmDateRange = false;
  showConfirmIndefinite = false;
  mfaRequireExemptionPeriod = false;
  model = {
    selectedMfaDate: null,
    onyen: null,
    reason: null,
    incidentNumber: null
  };
  test = null;
  showConfirm7Day() {
    this.showConfirm7day = true;
    this.$refs.confirm7day.show();
  }
  showConfirmDateRangeDlg() {
    this.showConfirmDateRange = true;
    this.$refs.confirmDateRange.show();
  }
  showConfirmIndefiniteDlg() {
    this.showConfirmIndefinite = true;

    this.model.selectedMfaDate = null
    this.$refs.confirmIndefinite.show();
  }
  get default7Days() {
    let d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString('en-US');
  }
  get label() {
    if (!this.mfaAccountStatus) return "";
    if (this.mfaAccountStatus.disabled) return "Disabled";
    return "Enabled";
  }
  async mounted() {
    this.toastService.set(this);

    this.clear();

  }
  mfaStatusChanged(newValue) {
    if (!this.mfaAccountStatus) return;

    this.mfaAccountStatus.disabled = !newValue;
    this.mfaRequireExemptionPeriod = !newValue;

  }
  async search() {
    this.mfaAccountStatus = null;
    this.spinnerService.show();
    try {
      this.mfaAccountStatus = await this.ExchangeToolsService.getMfaAccountStatus(this.filter);


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve MFA account status");
    } finally {
      this.spinnerService.hide();
    }

  }
  reCreateModel() {
    //https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
    //we have to define our model before create, we can't add properties after binding because Vue can't handle it. 
    //There are workarounds such as using Vue.set but it's not very clean IMO 
    //example 

    //Vue.set(this.model, 'selectedMfaDate', moment(d, "MM/DD/YYYY").format("MM/DD/YYYY"));

    //This issue was observed with the date control, any changes made to the date model data was not reflecting back to the parent
    //I initially didn't define the properties of the object and noted that changes to date in the control were not updating the parent. 
    //I used Vue.set and it began working but we'll just define the properties prior to binding

    this.model = {
      selectedMfaDate: null,
      onyen: null,
      reason: null,
      incidentNumber: null
    };
  }
  clear() {
    const moment = this.moment;
    this.reCreateModel();
    this.filter = "";
    this.mfaAccountStatus = null;

    this.showConfirm7day = false;
    this.showConfirmDateRange = false;
    this.showConfirmIndefinite = false;

    let d = new Date();
    d.setDate(d.getDate() + 7);
    this.model.selectedMfaDate = moment(d, "MM/DD/YYYY").format("MM/DD/YYYY");


  }
  async saveChanges() {
    this.spinnerService.show();
    try {
      await this.ExchangeToolsService.updateMfaAccountStatus(this.model);
      return true;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to apply MFA changes");
      return false;
    } finally {
      this.spinnerService.hide();
    }
  }
  async submitMfaChange() {

    let errors = this.validate();

    if (errors.length) {
      this.toastService.error(errors.join("<br/>"));
      //this.$refs.validationModal.show();
      return;
    } else {
      this.model.onyen = this.filter;
      let success = await this.saveChanges();
      
      if (success) {
        this.toastService.success("success");
        this.cancelMfaChange();  
      }
      
      
      
    }

    

  }
  cancelMfaChange() {
    const moment = this.moment;
    let d = new Date();
    d.setDate(d.getDate() + 7);
    this.reCreateModel();
    this.model.selectedMfaDate = moment(d, "MM/DD/YYYY").format("MM/DD/YYYY");
    //Vue.set(this.model, 'selectedMfaDate', moment(d, "MM/DD/YYYY").format("MM/DD/YYYY"));
    this.$refs.confirm7day.hide();
    this.$refs.confirmDateRange.hide();
    this.$refs.confirmIndefinite.hide();

    this.showConfirm7day = false;
    this.showConfirmDateRange = false;
    this.showConfirmIndefinite = false;
    this.clearValidation();
  }
}