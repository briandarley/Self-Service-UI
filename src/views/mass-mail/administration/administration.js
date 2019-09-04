import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'administration',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService']
  })
export default class Administration extends Vue {
  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Administration");
  }
  
}

