import Vue from "vue"
import {Component} from "vue-property-decorator";

import ProvisionsWidget from './components/provisions-widget.vue';
import AdLockWidget from './components/ad-lock-widget.vue';
import GalSyncWidget from './components/gal-sync-widget.vue';
import BearerTokenWidget from './components/bearer-token-widget.vue';
import EnvironmentWidget from './components/environment-widget.vue';

@Component({
  name: 'dash-board',
  dependencies: ['$', 'moment', 'UserService', 'DashboardService', 'toastService', 'DataAnalyticsService','ScreenReaderAnnouncerService'],
  components: {ProvisionsWidget,AdLockWidget,GalSyncWidget,BearerTokenWidget,EnvironmentWidget}
 
})

export default class DashBoard extends Vue {
  
  async mounted() {
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Self Service Dashboard");
  }





}