import {
  Component
} from "vue-property-decorator";
import {
  mixins,
  BaseValidateMixin
} from "../../../components/mixins/index";

@Component({
  name: 'email-signup',
  dependencies: ['$', 'moment', 'spinnerService', 'toastService', 'ProvisionsService', 'UserProfileService', 'UserService','ScreenReaderAnnouncerService']
})
export default class EmailSignup extends BaseValidateMixin {
  showProgress = false;
  userId = null;
  provisionInfo = {};
  userLdapProfile = {};
  hospitalProfile = null;
  dualAccountProfile = null;
  selectedPrimaryDesignation = 0;
  viewLoaded = false;
  model = {
    mail: ""

  }
  get hasPrimaryAccountSelected() {
    if (!this.hasValidLdapRecord || !this.isProvisionRecord || !this.dualAccountProfile) {
      return false;
    }
    return this.dualAccountProfile.primaryDesignation > 0;

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
  get isDualAccountEligible() {
    if (!this.isProvisionRecord) {
      return false;
    }
    //user must have a dualrole record prior, otherwise the user isn't allowed to choose
    if (!this.dualAccountProfile) return false;
    if (this.dualAccountProfile.status === false) return false;
    return (this.hospitalProfile && this.hospitalProfile.status !== false)
  }
  get isProvisionRecord() {
    if (!this.hasValidLdapRecord) return false;
    if (!this.provisionInfo) return false;
    if (this.provisionInfo.status === false) return false;
    return true;
  }
  get hasHospitalAccount() {

    if (!this.hasValidLdapRecord) return false;
    if (this.hospitalProfile === null) return false;
    if (this.hospitalProfile.status === false) return false
    return true;
  }
  get isMailboxCreated() {

    if (!this.provisionInfo) return false;
    return ["Notfied", "Created", "Completed"].indexOf(this.provisionInfo.status) > -1;
 }

  get hasValidLdapRecord() {
    return this.userLdapProfile.status !== false;
  }
  get isNewRequest() {

    if (this.userLdapProfile.status === false) return false;
    //record wasn't created int he provision table
    return (this.provisionInfo.status === false);
  }

  get showInEligible(){
    return !this.isNewRequest && this.hasValidLdapRecord && !this.isDualAccountEligible && this.hasHospitalAccount;
  }

  clear() {
    this.model.mail = "";
    this.clearValidation();
  }

  
  async submitNewProvisionRequest() {
    let errors = this.validate();
    if (errors.length) {
      this.toastService.error(errors.join("<br/>"));
      return;
    }
    this.spinnerService.show();
    try {
      await this.ProvisionsService.submitNewProvisionRequest(this.userId, this.model);
      this.toastService.success("Successfully submitted provision request.");
      
      await this.loadProvisionProfile();

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to submit provisioning request")
    } finally {
      this.spinnerService.hide();
    }
  }
  async updateDualRoleStatus(){
    this.spinnerService.show();
    try {
      await this.UserProfileService.updateMimsPrimaryDesignation(this.userId, this.selectedPrimaryDesignation);
      this.toastService.success("Successfully updated primary designation.");
      
      await this.loadProvisionProfile();

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to update primary designation")
    } finally {
      this.spinnerService.hide();
    }
  }

  setDestinationMail() {
    if (!this.hasValidLdapRecord) return;
    
    if (this.userLdapProfile.uncEmail.some(c => !c.endsWith("unc.edu"))) {
      let personalEmail = this.userLdapProfile.uncEmail.filter(c => !c.endsWith("unc.edu"));
      this.model.mail = personalEmail[0];
    }

  }
  setPrimaryDesignation() {
    this.selectedPrimaryDesignation = 0;
    if (!this.isDualAccountEligible) return;
    if (this.dualAccountProfile.primaryDesignation <= 2) {
      this.selectedPrimaryDesignation = this.dualAccountProfile.primaryDesignation;
    }
  }

  async setUserId() {
    let user = await this.UserService.get();
    this.userId = user.profile.sub

    //If user is admin and userId is supplied as param, then allow for impersonation
    if (!this.UserService.isInRole("ADMIN") && this.$route.params.userId) {
      this.userId = this.$route.params.userId;
    }

  }

  async mounted() {
    await this.loadProvisionProfile();
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("E-mail signup");

  }
  async loadProvisionProfile(){
    this.spinnerService.show();

    
    try {
      this.viewLoaded = false;
      await this.setUserId();
      this.toastService.set(this);
        
      let values = await Promise.all([
        this.ProvisionsService.getProvisionRecord(this.userId),
        this.UserProfileService.getLdapUserProfile(this.userId),
        this.UserProfileService.getMimsHospitalProfile(this.userId),
        this.UserProfileService.getMimsPrimaryDesignation(this.userId)
      ])


      this.provisionInfo = values[0];
      this.userLdapProfile = values[1];
      this.hospitalProfile = values[2];
      this.dualAccountProfile = values[3];
      this.setDestinationMail();
      this.setPrimaryDesignation();


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve LDAP profile for user")
    } finally {
      this.spinnerService.hide();
      this.viewLoaded = true;
    }
  }
}