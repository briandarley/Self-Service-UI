import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'mass-mail',
  dependencies: ['$', 'toastService', 'spinnerService', 'moment', 'MassMailService','ScreenReaderAnnouncerService']
  
  
})

export default class MassMail extends Vue {
  activeCampaigns = [];
  seletedMassMail = "";

  async mounted() {
    
    this.toastService.set(this);
    await this.loadSavedCampaigns()
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Landing");

  }

  async loadSavedCampaigns() { 
    
    try {
      this.spinnerService.show();

      let pagedResponse = await this.MassMailService.getCurrentMassMailByUser();
      this.activeCampaigns = pagedResponse;
    
    } catch (e) {
      window.console.log(e);
    
      this.toastService.error("Failed to retrieve existing campaigns for user");
    } finally {
      this.spinnerService.hide();
    }

  }

  deleteMassMail() {
    this.$refs.confirmDelete.show();
  }

  async editMassMail() {
    this.$router.push(`/create-request/${this.seletedMassMail}`);
  }

  async removeEntityClick() {
    try {
      await this.MassMailService.removeMassMailCampaign(this.seletedMassMail);
      this.seletedMassMail = "";
      this.toastService.success("Successfully Removed Mass Mail");
      await this.loadSavedCampaigns();


    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to delete campaign for user");
    } finally {
      this.$refs.confirmDelete.hide();
      this.spinnerService.hide();
    }


  }

  removeEntityCancelClick() {
    this.$refs.confirmDelete.hide();
  }

  
}