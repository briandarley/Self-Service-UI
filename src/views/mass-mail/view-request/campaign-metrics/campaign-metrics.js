import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import SimpleBar from "simplebar";
@Component({
  name: "campaign-metrics",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "MassMailService",
  ],
  props: ["campaignId"],
})
export default class CampaignMetrics extends Vue {
  entity = {};
  filter = {};
  simple = null;
  userActivity = [];
  calculating = false;
  notFound = false;
  searchTimeout = null;
  _currentCol = "totalReads"
  _currentSortDir = 1;

  userActivityCriteria = {
    pageSize: 100,
    index: 0,
    viewType: 0, //ByCountryCity
    previouslyGeoCoded: true,
    country: null,
    region: null,
    city: null,
    filterText: null,
    sort: "totalReads",
  };
  

  @Watch("campaignId", { immediate: false })
  async onCampaignIdChanged(newvalue) {
    this.notFound = false;
    await this.getUserActivity(newvalue);
    this.userActivityCriteria.index = 0;
    
    
  }
  
  attachScroll() {
    const $ = this.$;
    setTimeout(() => {
      $(".sdd-grid").each((item) => {
        this.simple = new SimpleBar($(".sdd-grid")[item], {
          autoHide: false,
          classNames: {
            scrollbar: "slim-scrollbar",
          },
        });
      });
    }, 100);
  }

  async getUserActivity(campaignId) {
    try {
      this.calculating = true;
      this.userActivityCriteria.campaignId = campaignId;
      //TODO Switch to user activity by Country, Country/City, and by IP Criteria object
      let responses = await Promise.all([
        this.MassMailService.getCampaignReadStatistics(campaignId)//,
        
      ]);
      //todo remove if we ever want to use geo location in future
      responses.push(true);
      if (responses[0] === false || responses[1] === false) {
        this.notFound = true;
        //this.toastService.error("Campaign activity not found");
      }

      this.entity = responses[0];
      //this.userActivity = responses[1];
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve campaign activity");
    } finally {
      this.calculating = false;
      this.attachScroll();
    }
  }

  


  
  
  async mounted() {
    this.toastService.set(this);
  }
}
