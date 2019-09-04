import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'mfa',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService']
  })

export default class Mfa extends Vue {
  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Exchange Tools - MFA Landing");
  }
  
}

