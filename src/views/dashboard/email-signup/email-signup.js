import {
  Component
} from "vue-property-decorator";
import {
  BaseValidateMixin
} from "../../../components/mixins/index";
import DualRoleAssignment from './dual-role-assignment.vue'
@Component({
  name: 'email-signup',
  dependencies: ['$', 'moment', 'spinnerService', 'toastService', 'ProvisionsService', 'UserProfileService', 'UserService','ScreenReaderAnnouncerService'],
  components: {DualRoleAssignment}
})
export default class EmailSignup extends BaseValidateMixin {
  showProgress = false;
  userId = null;
  provisionInfo = null;
  userLdapProfile = null;
  
  viewLoaded = false;
  model = {
    mail: ""

  }
  
  
  
  get isProvisionRecord() {
    
    if (!this.hasValidLdapRecord) return false;
    if (!this.provisionInfo) return false;
    if (this.provisionInfo.status === false) return false;
    return true;
  }
  
  get isMailboxCreated() {

    if (!this.provisionInfo) return false;
    return ["Notfied", "Created", "Completed"].indexOf(this.provisionInfo.status) > -1;
 }

  get hasValidLdapRecord() {
    if(!this.userLdapProfile) return false;
    return this.userLdapProfile.status !== false;
  }
  get isNewRequest() {
    if(!this.provisionInfo) return false;
    if (this.userLdapProfile.status === false) return false;
    //record wasn't created int he provision table
    return (this.provisionInfo.status === false);
  }



  clear() {
    this.model.mail = "";
    this.clearValidation();
  }

  
  async submitNewProvisionRequest() {
    let errors = this.validate(this.$refs.submitForm);
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
  async updateDualRoleStatus() {
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
  async loadProvisionProfile() {
    this.spinnerService.show();

    
    try {
      this.viewLoaded = false;
      await this.setUserId();
      this.toastService.set(this);
        
      let values = await Promise.all([
        this.ProvisionsService.getProvisionRecord(this.userId),
        this.UserProfileService.getLdapUserProfile(this.userId)
        
      ])


      this.provisionInfo = values[0];
      this.userLdapProfile = values[1];
      
      this.setDestinationMail();
      


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve LDAP profile for user")
    } finally {
      this.spinnerService.hide();
      this.viewLoaded = true;
    }
  }

  onUpdatedDualRoleStatus(){
    
  }
}