import {
  Component,
  Watch
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
  showConfirmEnableMfa = false;
  mfaRequireExemptionPeriod = false;
  mfaMethodType = null;
  recordSaved = false;
  model = {
    selectedMfaDate: null,
    onyen: null,
    reason: null,
    incidentNumber: null
  };

  test = null;
  @Watch("mfaAccountStatus", {
    immediate: false,
    deep: true
  })
  onMfaAccountStatusChanged(newValue, oldValue) {

    if (!oldValue || !newValue) return;
    this.mfaStatusChanged(newValue.enabled);
    if (newValue.enabled) {
      if (!this.recordSaved) return;
      this.showConfirmEnableMfa = true;
      this.$refs.confirmEnableMfa.show();
    }
  }

  get mfaExemptBeginDate() {
    let model = this.mfaAccountStatus;
    if (!model) return null;
    if (!model.mfaExemptBeginDate) return null;
    return this.$options.filters.formatDate(model.mfaExemptBeginDate)

  }
  get mfaExemptEndDate() {
    let model = this.mfaAccountStatus;
    if (!model) return null;
    if (!model.mfaExemptEndDate) return null;
    return this.$options.filters.formatDate(model.mfaExemptEndDate)

  }

  get showContactMethod() {
    if (!this.mfaMethodType) return false;
    if (!this.mfaMethodType.phoneNumber && !this.mfaMethodType.deviceName && !this.mfaMethodType.methodType) {
      return false;
    }
    return true;
  }

  showConfirm7Day() {
    const moment = this.moment;
    let d = new Date();
    d.setDate(d.getDate() + 7);
    this.model.selectedMfaDate = moment(d, "MM/DD/YYYY").format("MM/DD/YYYY");

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
  //Sets the default date 7 days from today
  get default7Days() {
    let d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString('en-US');
  }
  //Sets label for the switch to either 'Enable' or 'Disabled'
  get label() {
    if (!this.mfaAccountStatus) return "";
    if (!this.mfaAccountStatus.enabled) return "Disabled";
    return "Enabled";
  }

  async mounted() {
    this.toastService.set(this);

    this.clear();

  }

  mfaStatusChanged(newValue) {
    if (!this.mfaAccountStatus) return;

    this.mfaRequireExemptionPeriod = !newValue;

  }

  async search() {
    this.mfaAccountStatus = null;
    this.mfaRequireExemptionPeriod = false;

    let errors = this.validate(this.$refs.searchForm);
    if (errors.length) {
      this.toastService.error("Validation Failed");
      return false;
    }


    this.spinnerService.show();
    try {

      let response = await this.ExchangeToolsService.getMfaAccountStatus(this.filter);
      this.mfaMethodType = await this.ExchangeToolsService.getMfaMethodType(this.filter);

      if (response.status == false) {
        throw "Failed to retrieve MFA account status";
      }

      if (response.mfaExemptBeginDate || response.mfaExemptEndDate) {
        response.enabled = false;
        this.recordSaved = true;
      }

      this.mfaAccountStatus = response;

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve MFA account status");
    } finally {
      this.spinnerService.hide();
    }

  }

  reCreateModel() {
    //Issue we can simply define our model like...
    /*
      model = {};
    */
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

    this.clearValidation();


    const moment = this.moment;
    this.mfaMethodType = null;
    this.reCreateModel();
    this.filter = "";
    this.mfaAccountStatus = null;
    this.mfaRequireExemptionPeriod = false;

    this.showConfirm7day = false;
    this.showConfirmDateRange = false;
    this.showConfirmIndefinite = false;
    this.showConfirmEnableMfa = false;

    let d = new Date();
    d.setDate(d.getDate() + 7);
    this.model.selectedMfaDate = moment(d, "MM/DD/YYYY").format("MM/DD/YYYY");


  }

  async saveChanges() {
    this.spinnerService.show();
    try {
      await this.ExchangeToolsService.updateMfaAccountStatus(this.model);
      this.recordSaved = true;
      return true;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to apply MFA changes");
      return false;
    } finally {
      this.spinnerService.hide();
    }
  }

  async submitMfaChange(ref) {

    let errors = [];
    if (ref) {
      errors = this.validate(this.$refs[ref]);
    }

    if (errors.length) {
      this.toastService.error(errors.join("<br/>"));
      return;
    } else {
      this.model.onyen = this.filter;
      let success = await this.saveChanges();

      if (success) {
        this.toastService.success("success");
        this.cancelMfaChange();
        return success;
      }
    }

    return false;

  }

  cancelMfaChange() {

    this.$refs.confirm7day.hide();
    this.$refs.confirmDateRange.hide();
    this.$refs.confirmIndefinite.hide();


    const moment = this.moment;
    let d = new Date();
    d.setDate(d.getDate() + 7);
    this.reCreateModel();
    this.model.selectedMfaDate = moment(d, "MM/DD/YYYY").format("MM/DD/YYYY");

    this.showConfirm7day = false;
    this.showConfirmDateRange = false;
    this.showConfirmIndefinite = false;
    this.showConfirmEnableMfa = false;
    this.clearValidation();
  }

  cancelEnableMfa() {

    this.$refs.confirmEnableMfa.hide();
    this.mfaAccountStatus.enabled = false;
    this.cancelMfaChange();
  }

  async enableMfa() {
    this.$refs.confirmEnableMfa.hide();

    this.model.selectedMfaDate = null;
    this.model.reason = null;
    this.model.enabled = true;

    this.model.onyen = this.filter;

    this.showConfirmEnableMfa = false;
    let response = await this.submitMfaChange();
    
    if (response) {
      this.mfaAccountStatus.mfaEnabled = true;
    }


  }

  watchBtn(event, element){
      if(!(event.which === 32 || event.which === 13 )) return;
    switch(element){
      case 'mfa-end-date-7-day':
        this.showConfirm7Day();
        break;
        case 'mfa-end-date-range':
        this.showConfirmDateRangeDlg();
        break;
        case 'mfa-end-date-pick-date':
        this.showConfirmIndefiniteDlg();
        break;
    }
           
  }
}