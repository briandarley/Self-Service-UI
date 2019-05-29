import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'mass-mail',
  dependencies: ['$', 'toastService', 'spinnerService', 'moment', 'MassMailService'],
  components: {}
  //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
})

export default class MassMail extends Vue {
  activeCampaigns = [];
  seletedMassMail = "";

  async mounted() {
    this.spinnerService.show();
    this.toastService.set(this);
    try {
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