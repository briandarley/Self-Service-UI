import {
  BaseValidateMixin
} from "../../../../components/mixins/index";

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
    "ValidationService",
    "ScreenReaderAnnouncerService"
    
  ]
})
export default class Aliases extends BaseValidateMixin {
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
  
  
  /*
  If the user has role 
  ITS_WSP-Tools-ExchangeTools-Aliases-kenan-flagler
  allow for alias 'kenan-flagler.unc.edu'
  */
  @Watch("primary", {
    immediate: false
  })
  async onEmailAddressesChanged(newValue) {
    let emailAddress = this.emailAddresses.find(c => c.primary);
    if( emailAddress)
    {
      emailAddress.primary = false;
    }
    emailAddress = this.emailAddresses.find(c => c.email === newValue);
    if( emailAddress)
    {
      emailAddress.primary = true;
    }
    
  }

  async search() {
    let errors = this.validate(this.$refs.searchForm);
    
    if (errors.length) {
      this.toastService.error("Validation Failed");
      return false;
    }
    
    this.spinnerService.show();
    try {
      this.loadingAliases = true;
      this.adUser = null;
      
      
      let responses = await Promise.all([this.ExchangeToolsService.getAdUsers({samAccountName: this.filter})]);

      let pagedResponse = responses[0];
      
            

      if(pagedResponse.status === false || pagedResponse.totalRecords == 0){
        this.toastService.error("User not found");
        return;
      }
      
      this.adUser =  pagedResponse.entities[0];
      
      
      if(this.adUser.msExchGenericForwardingAddress && this.adUser.msExchGenericForwardingAddress.startsWith("smtp:")){
        this.adUser.msExchGenericForwardingAddress = this.adUser.msExchGenericForwardingAddress.substring(5);
      }
      
      this.emailAddresses = this.CommonExtensions.getValidEmailAddresses(
        this.adUser.proxyAddresses
      );
      let emailAddress  = this.emailAddresses.find(c => c.primary);
      if( emailAddress)
      {
        this.primary = emailAddress.email;
      }
      
    } catch (e) {
      
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
         this.toastService.error(`Failed to add alias. Error Response: ${response.message}`);
         return;
      }
      this.newAliasPrefix = "";

      if (this.adminProfile.adminAliases && this.adminProfile.adminAliases.length) {
        this.newAliasDomain = this.adminProfile.adminAliases[0];
      }

    } catch (e) {
      
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
    
    if (this.adminProfile.adminAliases && this.adminProfile.adminAliases.length) {
      this.newAliasDomain = this.adminProfile.adminAliases[0];
    }
  }

  confirmChangePrimaryAlias(event){
    
    let emailAddress = this.emailAddresses.find(c=> c.primary);
    if( emailAddress)
    {
      this.currentPrimary = emailAddress.email;
    }
    
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
      this.toastService.error("Failed to set new primary alias");
    }
    finally{
      this.selectedPrimarySmtp = "";
      this.$refs.confirmChangePrimaryAliasDialog.hide();
      
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
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Exchange Tools - Aliases");
  }

  async setForwardingAddress() {
    try{
      
      if(this.adUser.msExchGenericForwardingAddress && !this.ValidationService.isValidEmail(this.adUser.msExchGenericForwardingAddress))
      {
        this.toastService.error("Invalid forwarding address. Value must be a valid email");
      }
      else{
        this.spinnerService.show();
           
        await this.ExchangeToolsService.setForwardingAddress(this.adUser.samAccountName, this.adUser.msExchGenericForwardingAddress);
        
        this.toastService.success("Successfully set forwarding address for account");
      }

      

    } catch (e){
      
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
    this.newAliasPrefix = "";
    this.$refs.addEmailAliasDialog.hide();
  }

  allowRemove(alias) {
    let email = alias.email.toUpperCase();
    if(email.endsWith("@AD.UNC.EDU") || email.endsWith("@EMAIL.UNC.EDU"))
    {
      return false;
    }
    return true;
  }
}
