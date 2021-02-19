
import {
  BaseValidateMixin
} from "../../../../components/mixins/index";

import { Component } from "vue-property-decorator";
import DualRoleAssignment from '../../../dashboard/email-signup/dual-role-assignment.vue';

@Component({
    name: 'provisioning',
    dependencies: [    
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "UserService",
    "ValidationService",
    "ScreenReaderAnnouncerService"]   ,
    components: { DualRoleAssignment}
    
  })

export default class Provisioning extends BaseValidateMixin {
  filter = "";
  provisionData = {};
  userLdap = null;
  noLdap = false;
  enterEmailResponse = false;
  emailResponse = [];
  userProfile = {};
  emailEntry = "";
  selectedEmail = "";

  async mounted() {
    this.toastService.set(this);
    let user = await this.UserService.get();
    this.userProfile = user.profile;
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Exchange Tools - Provisioning");
  }

  get showNewProvision() {
    if (this.provisionData.status === false && this.userLdap !== null) {
      return true;
    }
    return false;
  }
  get showNoLdapRecord() {
    
    return this.noLdap;
  }

  nextStep() {
    this.enterEmailResponse = true;
  }

  async submit() {
    this.spinnerService.show();
    try {
      await this.ExchangeToolsService.submitProvisionRequest(
        this.userLdap.uid,
        this.emailResponse
      );
      this.toastService.success("Successfully kicked off provisioning request");
      this.clear();
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to initiate provision request");
    } finally {
      this.spinnerService.hide();
    }
  }

  async search() {
    this.clearBaseFields();

    let errors = this.validate(this.$refs.submitForm);
    if (errors.length) {
      this.toastService.error(`Validation Failed, ${errors.join(",")}`);
      return false;
    }


    if (!this.filter) {
      this.toastService.error("Invlaid search params");
      return;
    }
    this.spinnerService.show();

    try {

      let provisionData = await this.ExchangeToolsService.getProvisionHistory(
        this.filter
      );
      
      if(!provisionData){
        provisionData = {};
      }
      this.provisionData = provisionData; 

      if (provisionData.status === false) {
        
        let userLdap = await this.ExchangeToolsService.getUserLdap(this.filter);
        

        if (userLdap && userLdap.status === false) {
          this.toastService.error("Failed to retrive LDAP record for user, user not found");
          this.noLdap = true;
          return;
        } else if (userLdap) {
          this.userLdap = userLdap;
          //populate the list of responses
          this.populateEmails();
          const $ = this.$;
          var htmlMessage = $("#request-new-provision-notice").html();
          
          this.ScreenReaderAnnouncerService.sendAnnouncement(htmlMessage);
        }
      } 
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve provision history");
    } finally {
      this.spinnerService.hide();
    }
  }

  removeSelectedEmail() {
    let index = this.emailResponse.indexOf(this.selectedEmail);
    this.emailResponse.splice(index, 1);
  }

  populateEmails() {
    this.emailResponse = [];
    
    if (this.userLdap.mail && typeof(this.userLdap.mail) === "string") {
      this.emailResponse.push(this.userLdap.mail);
    } else if (this.userLdap.uncEmail && this.userLdap.uncEmail.length > 0) {
      this.emailResponse = this.emailResponse.concat(this.userLdap.uncEmail);
    }

    this.emailResponse.push(this.userProfile.email);
    this.selectedEmail = this.userProfile.email;
  }

  clearBaseFields() {
    this.provisionData = {};
    this.userLdap = null;
    this.noLdap = false;
    this.enterEmailResponse = false;
    this.emailEntry = "";
  }

  clear() {
    this.filter = "";
    this.emailResponse = [];

    this.clearBaseFields();
  }

  addEmail() {
    if (!this.ValidationService.isValidEmail(this.emailEntry)) {
      this.toastService.error("Invalid e-mail address");
      return;
    }
    if (this.emailResponse.some(c => c == this.emailEntry)) {
      this.toastService.error("Duplicate e-mail detected");
      return;
    }
    this.emailResponse.push(this.emailEntry);
    this.emailEntry = "";
    this.toastService.success("E-mail successfully added");
  }
  closeConfirmAction(){
    this.$refs.confirmAction.hide();
  }
  confimReprovisionAccount() {
    
    this.$refs.confirmAction.show();
  }

  async reprovisionAccount() {
    try {
      this.spinnerService.show();

      this.provisionData.status = 'Submitted';

      let respose = await this.ExchangeToolsService.updateProvisionRecord(this.provisionData)

      if (respose.status) {
        this.toastService.success("Successfully updated provisioning record");
        
        await this.search();
      } else {
        this.toastService.error("Failed to update provisioning record, not found");
        
        
      }
      this.closeConfirmAction();


    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to update provisioning');
    } finally {
      this.spinnerService.hide();
    }

  }

}

