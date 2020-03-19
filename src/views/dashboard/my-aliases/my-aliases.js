import {
  BaseValidateMixin
} from "../../../components/mixins/index";


import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'my-aliases',
  dependencies: ['$', 'spinnerService', 'toastService', 'UserProfileService', 'UserService', 'DashboardService','CommonExtensions','ScreenReaderAnnouncerService']

})

export default class MyAliases extends BaseValidateMixin {
  userId = null;
  userLdapProfile = null;
  userAdProfile = null;
  emailAddresses = [];
  allowedDomains = [];
  monitorEmailAddressChange = false;
  successfullyLoaded = true;
  mailPrefix = "";

  model = {
    email: "",
    mailPrefix: "",
    domain: ""
  };
  @Watch("emailAddresses", {
    immediate: false,
    deep: true
  })
  onEmailAddressChanged(_newValue, oldValue) {
    if (!this.monitorEmailAddressChange) return;

    if (oldValue === undefined || oldValue.length == 0) return;
    this.primaryAliasChanged = true;

  }

  get newAlias() {
    return `${this.model.mailPrefix}@${this.model.domain}`;
  }

  async save() {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
      this.toastService.success("Successfully updated alias");

    }, 1000);
  }

  async setUserId() {
    let user = await this.UserService.get();
    this.userId = user.profile.sub

    //If user is admin and userId is supplied as param, then allow for impersonation
    if (!this.UserService.isInRole("ADMIN") && this.$route.params.userId) {
      this.userId = this.$route.params.userId;
    }

  }

  getEmailAddresses() {
    let proxyAddresses = this.userAdProfile.proxyAddresses.filter(c => !c.endsWith("adminliveunc.mail.onmicrosoft.com"))
    let smtpAddresses = proxyAddresses.map(c => {
      if (c.startsWith("SMTP:")) {
        return {
          originalPrimary: true,
          selected: true,
          email: this.$options.filters.toEmail(c)
        }
      } else if (c.startsWith("smtp:")) {
        return {
          originalPrimary: false,
          selected: false,
          email: this.$options.filters.toEmail(c)
        }
      }
    })

    return smtpAddresses.filter(c => c !== undefined);
  }

  async mounted() {
    this.toastService.set(this);
    this.spinnerService.show();
    try {
      await this.loadProvisionProfile();
      this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("My E-mail Aliases");
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve user profile");

    } finally {
      this.spinnerService.hide();

      
    }

  }

  get showAddAlias() {
    if (this.UserService.isInRole("HELP_DESK")) return true;
    return (this.emailAddresses && this.emailAddresses.length <= 5);
  }

  async loadProvisionProfile() {
    this.viewLoaded = false;
    await this.setUserId();
    this.toastService.set(this);
    try {
      this.monitorEmailAddressChange = false;
      this.spinnerService.show();
      let values = await Promise.all([
        this.UserProfileService.getLdapUserProfile(this.userId),
        this.UserProfileService.getAdUserProfile(this.userId),
        this.UserProfileService.getAvailableDomains(this.userId)
      ])

      this.userLdapProfile = values[0];
      this.userAdProfile = values[1];
      this.allowedDomains = values[2];

      if (this.userAdProfile.status === false ||
        this.userLdapProfile.status == false ||
        this.userAdProfile.accountEnabled === false) {
        this.successfullyLoaded = false;
        return;
      }

      this.emailAddresses = this.getEmailAddresses();

      this.model.email = this.userLdapProfile.mail;

      this.primaryAliasChanged = false;
      this.monitorEmailAddressChange = true;

      this.model.domain = this.allowedDomains[0];

    } catch (e) {
      window.console.log(e);
      this.successfullyLoaded = false;
      this.toastService.error("Failed to retrieve LDAP profile for user")
    } finally {
      this.spinnerService.hide();
      this.viewLoaded = true;
    }
  }

  async updatePrimaryAlias() {
    this.spinnerService.show();
    try {
      let primarySmtp = this.emailAddresses.find(c => c.selected);
      await this.UserProfileService.updatePrimaryAlias(this.userId, primarySmtp.email)
      this.toastService.success("Successfully updated primary alias");
      this.emailAddresses = [];

      await this.loadProvisionProfile();
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to update primary alias');
    } finally {
      this.spinnerService.hide();
    }
  }

  async removeAlias(alias) {
    this.spinnerService.show();
    try {

      await this.UserProfileService.removeEmailAlias(this.userId, alias.email);

      this.toastService.success("Successfully removed alias");
      await this.cancelPrimaryAlias();
    } catch (e) {
      window.console.log(e);
      this.toastService.error('');
    } finally {
      this.spinnerService.hide();
    }
  }

  allowRemove(alias) {
    let email = alias.email.toUpperCase();
    if(email.endsWith("@AD.UNC.EDU") || email.endsWith("@EMAIL.UNC.EDU"))
    {
      return false;
    }
    return true;
  }

  async cancelPrimaryAlias() {
    this.userLdapProfile = null;
    this.userAdProfile = null;
    this.emailAddresses = [];
    this.allowedDomains = [];
    this.monitorEmailAddressChange = false;
    this.primaryAliasChanged = false;
    this.successfullyLoaded = true;
    this.model = {
      email: "",
      mailPrefix: "",
      domain: ""
    };
    this.primaryAliasChanged = false;
    await this.loadProvisionProfile();
  }

  _underMaxAliasCount() {
    //check if user is an admin, if so return true
    if (this.UserService.isInRole("HELP_DESK")) return true;

    return this.emailAddresses.length <= 6
  }

  async _validateAliasEntry() {
    
    let errors = this.validate(this.$refs.submitForm);
    if (errors.length) {

      this.toastService.error(`Validation Failed, ${errors.join(",")}`);
      return false;
    }
    if (!this.newAlias) {
      this.toastService.error("Invalid email")
      return false;
    }
    if(!this.CommonExtensions.isValidEmailAddress(this.newAlias)){
      this.toastService.error("Invalid email")
      return false;
    }
    

    //this needs to be false, meaning alias has not been added. 
    let adUserProfile = await this.DashboardService.getAdUserProfile(this.newAlias);

    if (adUserProfile.status !== false) {
      this.toastService.error("Requested alias has already been taken by another user. ")
      return false;
    }

    if (!this._underMaxAliasCount()) {
      this.toastService.error("You have exceeded the maximum number of allowed aliases.  You must be below the maximum of 5 before being allowed to add another.")
      return false;
    }

    return true;
  }

  async addAlias() {
    if (!await this._validateAliasEntry()) return;


    this.spinnerService.show();
    try {
      await this.UserProfileService.addEmailAlias(this.userId, this.newAlias)
      this.toastService.success("Successfully added new alias");
      await this.cancelPrimaryAlias();
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to add new alias');
    } finally {
      this.spinnerService.hide();
    }
  }


  async setPrimaryAlias(alias) {
    this.spinnerService.show();
    try {

      await this.UserProfileService.updatePrimaryAlias(this.userId, alias.email)
      this.toastService.success("Successfully updated primary alias");
      await this.cancelPrimaryAlias();

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to set Primary Alias');
    } finally {
      this.spinnerService.hide();
    }
  }

}