import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'campus-directory-info',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService'],
    props: ['data']
  
  })

export default class CampusDirectoryInfo extends Vue {
  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Campus Directory Info");
    
  }
  get homeAddress(){
    if(!this.data.homeAddress) return "";
   
    let fields = this.$options.filters.splitString(this.data.homeAddress,"$");
    return fields.join("<br/>");
  }
  
}

