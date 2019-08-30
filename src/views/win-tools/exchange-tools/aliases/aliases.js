import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "aliases",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "CommonExtensions",
    "AdminProfileService",
    "ValidationService"
    
  ]
})
export default class Aliases extends Vue {
  adminProfile = {};

  adUser = null;
  emailAddresses = [];
  filter = "";
  primary = "";
  newAliasDomain = "";
  newAliasPrefix = "";
  loadingAliases = false;
  deleteEntity = {};
  selectedPrimarySmtp = "";
  currentPrimary = "";
  
  mailbox = {};
  /*
  If the user has role 
  ITS_WSP-Tools-ExchangeTools-Aliases-kenan-flagler
  allow for alias 'kenan-flagler.unc.edu'
  */
  @Watch("primary", {
    immediate: false
  })
  async onEmailAddressesChanged(newValue) {
    this.emailAddresses.find(c => c.primary).primary = false;
    this.emailAddresses.find(c => c.email === newValue).primary = true;
  }

  async search() {
    this.spinnerService.show();
    try {
      this.loadingAliases = true;
      this.adUser = null;
      
      let responses = await Promise.all([this.ExchangeToolsService.getAdUser(this.filter), this.ExchangeToolsService.getOffice365Mailbox(this.filter)]);

      let adUser = responses[0];
      let mailbox = responses[1];
      

      if(adUser.status === false){
        this.toastService.error("User not found");
        return;
      }
      if(mailbox.status === false){
        this.toastService.error(`Mailbox for user ${this.filter} not found`);
        return;
      }
      this.adUser = adUser;
      
      if(mailbox.forwardingSmtpAddress && mailbox.forwardingSmtpAddress.startsWith("smtp:")){
        mailbox.forwardingSmtpAddress = mailbox.forwardingSmtpAddress.substring(5);
      }
      this.mailbox = mailbox;
      this.emailAddresses = this.CommonExtensions.getValidEmailAddresses(
        this.adUser.proxyAddresses
      );

      this.primary = this.emailAddresses.find(c => c.primary).email;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve AD user");
    } finally {
      this.spinnerService.hide();
      //this.loadingAliases = false;
    }
  }
  
  async confrimDeleteEntity(entity) {
   if(!entity.valid)
   {
     return;
   }
   if(entity.primary){
     this.toastService.warn("Can't remove primary");
     return;
   }
    this.deleteEntity = entity;
    this.$refs.confirmDelete.show();
    
  }
  
  async addEmailAlias() {
    try {
      this.spinnerService.show();
      let newAlias = `${this.newAliasPrefix}@${this.newAliasDomain}`;

      if (!this.ValidationService.isValidEmail(newAlias)) {
        this.toastService.error("Invalid e-mail address");
        return;
      }
      this.closeAddEmailAliasDialog();
      let response = await this.ExchangeToolsService.addAlias(
        this.adUser.samAccountName,
        newAlias
      );

      if (response.success) {
        this.toastService.success("Successfully added alias");
      } else {
        this.toastService.error(response.errorMessage);
      }
      this.newAliasPrefix = "";

      if (this.adminProfile.adminAliases && this.adminProfile.adminAliases.length) {
        this.newAliasDomain = this.adminProfile.adminAliases[0];
      }

    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to add alias");
    } finally {
      this.spinnerService.hide();
      await this.search();
    }
  }
  
  clear() {
    this.filter = "";
    this.emailAddresses = [];
    this.adUser = null;
    this.newAliasPrefix = "";
    this.mailbox = {};
    if (this.adminProfile.adminAliases && this.adminProfile.adminAliases.length) {
      this.newAliasDomain = this.adminProfile.adminAliases[0];
    }
  }

  confirmChangePrimaryAlias(event){
    this.currentPrimary = this.emailAddresses.find(c=> c.primary).email;
    
    this.selectedPrimarySmtp = event.target.value;
    
    this.$refs.confirmChangePrimaryAliasDialog.show();
  }
  
  async confirmChangePrimaryAliasClick() {
    try {
      let uid = this.adUser.samAccountName;
      
      if (!this.ValidationService.isValidEmail(this.selectedPrimarySmtp)) {
        this.toastService.error("Invalid e-mail address");
        return;
      }
      await this.ExchangeToolsService.setPrimaryAlias(uid, this.selectedPrimarySmtp);

      this.toastService.success("Successfully set primary alias");
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to set new primary alias");
    }
    finally{
      this.selectedPrimarySmtp = "";
      this.$refs.addEmailAliasDialog.hide();
      //
    }
  }

  confirmChangePrimaryAliasCancelClick() {
    
    this.primary = this.currentPrimary;
    this.$refs.confirmChangePrimaryAliasDialog.hide();
    
  }

  async removeEntityClick() {
    try {
      //uid, emailAddress
      this.adUser = await this.ExchangeToolsService.removeAlias(
        this.adUser.samAccountName,
        this.deleteEntity.email
      );

      this.toastService.success("Successfully removed alias");
      let index = this.emailAddresses.indexOf(this.deleteEntity);
      this.emailAddresses.splice(index, 1);
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to remove alias");
    }
    finally{
      this.$refs.confirmDelete.hide();
      this.deleteEntity = {};
    }
  }

  removeEntityCancelClick() {
    this.$refs.confirmDelete.hide();
  }

  async mounted() {
    this.toastService.set(this);
    this.adminProfile = await this.AdminProfileService.getAdminProfile();
    
    if (this.adminProfile.adminAliases && this.adminProfile.adminAliases.length) {
      this.newAliasDomain = this.adminProfile.adminAliases[0];
    }
  }

  async setForwardingAddress() {
    try{
      
      if(this.mailbox.forwardingSmtpAddress && !this.ValidationService.isValidEmail(this.mailbox.forwardingSmtpAddress))
      {
        this.toastService.error("Invalid forwarding address. Value must be a valid email");
      }
      else{
        this.spinnerService.show();
           
        await this.ExchangeToolsService.setForwardingAddress(this.adUser.samAccountName, this.mailbox.forwardingSmtpAddress);
        
        this.toastService.success("Successfully set forwarding address for account");
      }

      

    } catch (e){
      window.console.log(e);
      this.toastService.error("Failed to set forwarding address");

    } finally{
      this.spinnerService.hide();
      this.closeAddFormwardingAddressDialog();
    }
  }
  
  showAddFormwardingAddressDialog() {
    this.$refs.confirmAddForwardingAddressDialog.show();  
  }

  closeAddFormwardingAddressDialog() {
    this.$refs.confirmAddForwardingAddressDialog.hide();  
  }

  showAddEmailAliasDialog() {
    this.$refs.addEmailAliasDialog.show();
  }

  closeAddEmailAliasDialog() {
    this.$refs.addEmailAliasDialog.hide();
  }
}
