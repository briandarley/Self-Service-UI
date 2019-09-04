import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'win-tools',
    dependencies: ['$','moment','ScreenReaderAnnouncerService']
  })
export default class WinTools extends Vue {
  async mounted() { 
    
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Landing Page");
  }
  
}

