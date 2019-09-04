import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'audit-info',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService'],
    props: ['data']  
    
  })

export default class AuditInfo extends Vue {

  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Audit Info");
  }
  
}

