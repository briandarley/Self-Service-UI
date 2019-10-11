import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'dual-role-assignment',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'UserProfileService'],
  props: ['onyen', 'provisionInfo']

})

export default class DualRoleAssignment extends Vue {
  selectedPrimaryDesignation = 0;
  dualAccountProfile = null;
  hospitalProfile = null;

  

  @Watch("onyen", {
    immediate: true
  })
  async onUserLdapProfile(newValue) {
    if (!newValue) return;
    await this.loadDualAccountProfile();
    await this.loadHospitalProfile();

    this.setPrimaryDesignation();
  }

  async loadDualAccountProfile() {
    try {
      this.spinnerService.show();
      
      this.dualAccountProfile = await this.UserProfileService.getMimsPrimaryDesignation(this.onyen)
      console.log(this.dualAccountProfile );
      
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to load Dual Account profile');
    } finally {
      this.spinnerService.hide();
    }
  }

  async loadHospitalProfile() {
    try {
      this.spinnerService.show();
      this.hospitalProfile = await this.UserProfileService.getMimsHospitalProfile(this.onyen);
      
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to load Hospital profile');
    } finally {
      this.spinnerService.hide();
    }

  }

  async mounted() {

    this.toastService.set(this);
  }

  get hasPrimaryAccountSelected() {
    if (!this.hasValidLdapRecord || !this.isProvisionRecord || !this.dualAccountProfile) {
      return false;
    }
    return this.dualAccountProfile.primaryDesignation > 0;

  }

  get hasValidLdapRecord() {
    if (!this.onyen) return false;
    return true;
  }

  get isProvisionRecord() {
    if (!this.hasValidLdapRecord) return false;
    if (!this.provisionInfo) return false;
    if (this.provisionInfo.status === false) return false;
    return true;
  }

  get primaryAccountDisplayName() {
    if (!this.hasPrimaryAccountSelected) {
      return "None";
    }
    switch (this.dualAccountProfile.primaryDesignation) {
      case 0:
        return "None (Designation 0)";
      case 1:
        return "UNC (Designation 1)"
      case 2:
        return "UNC Health Care (Designation 2)"
      case 3:
        return "Dual Account, Both UNC and UNC Health Care (Designation 3)"
    }
  }

  async updateDualRoleStatus() {
    this.spinnerService.show();
    try {
      await this.UserProfileService.updateMimsPrimaryDesignation(this.onyen, this.selectedPrimaryDesignation);
      this.toastService.success("Successfully updated primary designation.");

      this.$emit("updatedDualRoleStatus")

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to update primary designation")
    } finally {
      this.spinnerService.hide();
    }
  }
  get hasDualAccount(){
    
    return this.dualAccountProfile && this.dualAccountProfile.status === undefined;
  }
  get isDualAccountEligible() {
    if (!this.isProvisionRecord) {
      return false;
    }
    //user must have a dualrole record prior, otherwise the user isn't allowed to choose
    if (!this.dualAccountProfile) return false;
    if (this.dualAccountProfile.status === false) return false;
    return (this.hospitalProfile && this.hospitalProfile.status !== false)
  }

  get isNewRequest() {
    if (!this.provisionInfo) return true;
    
    //record wasn't created int he provision table
    return (this.provisionInfo.status === false);
  }

  get showInEligible() {
    

    return !this.isNewRequest && this.hasValidLdapRecord && this.hasHospitalAccount && !this.isDualAccountEligible;
  }

  get hasHospitalAccount() {

    if (!this.hasValidLdapRecord) return false;
    if (this.hospitalProfile === null) return false;
    if (this.hospitalProfile.status === false) return false
    return true;
  }

  setPrimaryDesignation() {
    this.selectedPrimaryDesignation = 0;
    if (!this.isDualAccountEligible) return;
    if (this.dualAccountProfile.primaryDesignation <= 2) {
      this.selectedPrimaryDesignation = this.dualAccountProfile.primaryDesignation;
    }
  }

}