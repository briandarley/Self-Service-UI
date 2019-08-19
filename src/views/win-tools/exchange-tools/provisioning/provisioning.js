import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'provisioning',
    dependencies: [    
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "UserService",
    "ValidationService"]   
    
  })

export default class Provisioning extends Vue {
  filter = "";
  provisionData = null;
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
  }

  get showNewProvision() {
    if (this.provisionData == null && this.userLdap !== null) {
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
    if (!this.filter) {
      this.toastService.error("Invlaid search params");
      return;
    }
    this.spinnerService.show();

    try {
      let provisionData = await this.ExchangeToolsService.getProvisionHistory(
        this.filter
      );

      if (provisionData.status === false) {
        let userLdap = await this.ExchangeToolsService.getUserLdap(this.filter);
        if (userLdap && userLdap.status === false) {
          this.toastService.error("Failed to retrive LDAP record for user");
          this.noLdap = true;
          return;
        } else if (userLdap) {
          this.userLdap = userLdap;
          //populate the list of responses
          this.populateEmails();
        }
      } else {
        this.provisionData = provisionData;
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
    
    if (this.userLdap.mail && typeof(this.userLdap.mail) == string) {
      this.emailResponse.push(this.userLdap.mail);
    } else if (this.userLdap.uncEmail && this.userLdap.uncEmail.length > 0) {
      this.emailResponse = this.emailResponse.concat(this.userLdap.uncEmail);
    }

    this.emailResponse.push(this.userProfile.email);
    this.selectedEmail = this.userProfile.email;
  }

  clearBaseFields() {
    this.provisionData = null;
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
}

