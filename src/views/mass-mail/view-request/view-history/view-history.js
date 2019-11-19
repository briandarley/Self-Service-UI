import Vue from "vue"
import {
  Component,
  Watch
} from "vue-property-decorator";

@Component({
  name: 'view-history',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'MassMailService' ],
  props: ['campaignId']

  
})

export default class ViewHistory extends Vue {
  entities = [];

  @Watch('campaignId', {immediate:false})
  async onCampaignIdChanged(){
    await this.loadHistory();
  }

  

  async loadHistory() {
    try {
      this.spinnerService.show();
      let entities = await this.MassMailService.getCampaignActions(this.campaignId);
      this.entities  = entities.sort((a,b)=> {
        if(a.id > b.id) return -1;
        if(a.id < b.id) return 1;
        return 0;
      });

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to load hisory');
    } finally {
      this.spinnerService.hide();
    }
  }

  async mounted() {
    this.toastService.set(this);
    //await this.loadHistory();
  }

}