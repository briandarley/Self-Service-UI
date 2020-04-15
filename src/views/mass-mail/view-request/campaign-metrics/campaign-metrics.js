import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'campaign-metrics',
    dependencies: ['$','moment','toastService','spinnerService','MassMailService'],
    props:['campaignId']
    
    
  })

export default class CampaignMetrics extends Vue {
  entity = {};
  topIpList = [];
  notFound = false;
  @Watch("campaignId", {immediate:false})
  async onCampaignIdChanged(newvalue){
    this.notFound = false;
    await this.getUserActivity(newvalue);
  }

  async getUserActivity(campaignId) {
    try {
      this.spinnerService.show();

      
      let responses = await Promise.all([
        this.MassMailService.getUserActivity(campaignId),
        this.MassMailService.getUserActivityByIp(campaignId)
        
      ]);

      if (responses[0] === false || responses[1] === false) {
        this.notFound = true;
        //this.toastService.error("Campaign activity not found");
      }

      this.entity = responses[0];
      this.topIpList =  responses[1];
      

    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to retrieve campaign activity');
    } finally {

      this.spinnerService.hide();
    }
  }
  
  async mounted() { 
    this.toastService.set(this);
    //this.MassMailService.getUserActivity
  }
  
}

