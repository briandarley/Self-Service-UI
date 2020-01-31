import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'my-ad-groups',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'DashboardService','ScreenReaderAnnouncerService'],

})

export default class MyAdGroups extends Vue {
  entities = [];
  async loadMyAdGroups() {
    try {
      this.spinnerService.show();
      let response = await this.DashboardService.getMyAdGroups();
      
      if(response.status === false)
      {
        this.toastService.error('Failed to retrieve My AD Groups');  
        this.entities = [];
        return;
      }
      response.data.sort((a,b)=>{
        if(a.toUpperCase() > b.toUpperCase()) return 1;
        if(a.toUpperCase() < b.toUpperCase()) return -1;
        return 0;
      })
      this.entities = response.data
    } catch (e) {
      window.console.log(e);
      this.toastService.error('Failed to retrieve My AD Groups');
    } finally {
      this.spinnerService.hide();
    }
  }
  async mounted() {
    this.toastService.set(this);
    await this.loadMyAdGroups();
    await this.search();
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("My Active Directory Groups");
  }

  criteria = {
    filterText: ''
  };
  async search() {
    this.$refs.groupManagment.loadEntities({initialLoad: true});
  }

  

  async clear() {
    this.criteria = {
      filterText: '',
      managedBy: ''
    }
    this.$refs.groupManagment.clear();
  }
 
  
}