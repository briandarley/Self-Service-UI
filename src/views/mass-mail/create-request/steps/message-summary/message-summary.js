import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'message-summary',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService']
  })

export default class MessageSummary extends Vue {
  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Message Summary");
  }
  
}

