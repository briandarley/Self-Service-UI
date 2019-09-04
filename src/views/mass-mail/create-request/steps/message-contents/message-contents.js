import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'message-contents',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService']
  })

export default class MessageContents extends Vue {
  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Mass Mail Message Content");
  }
  
}

