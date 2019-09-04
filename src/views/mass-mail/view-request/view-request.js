import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'view-request',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService']
    
    
  })

export default class ViewRequest extends Vue {
  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail View Request");
  }
  
}

