import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'office-365-info',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService'],
    props: ['data']
    
  })

export default class Office365Info extends Vue {
  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Office 365 Information");
  }
  
}

