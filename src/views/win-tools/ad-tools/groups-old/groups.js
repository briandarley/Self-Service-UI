import Vue from "vue"
import {
  Component
  
} from "vue-property-decorator";

@Component({
  name: 'groups',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'ExchangeToolsService', 'EventBus','ScreenReaderAnnouncerService']
  

})

export default class Groups extends Vue {
   
  criteria = {
    managedBy: '',
    filterText: ''

  };
   async search() {
   this.$refs.groupManagment.loadEntities();
  }

  

  async clear() {
    this.criteria = {
      filterText: '',
      managedBy: ''
    }
    this.$refs.groupManagment.clear();
  }
 
  async mounted() {
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Active Directory - Groups");

  }

}