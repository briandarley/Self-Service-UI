import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
  name: 'duo',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'DuoAuthService','localStorageService','ScreenReaderAnnouncerService','UserService','localStorageService']
})

export default class Duo extends Vue {
  initializeDuoMfaRequest() {
    this.DuoAuthService.initDuoFrame(this.duoCallback);
  }
  async mounted() {
    window.console.log("duo loaded");
    this.toastService.set(this);
    if (this.DuoAuthService.getDuoState() === "STATE_AUTH_PASSED") {
      return;
    }

     this.initializeDuoMfaRequest();
     this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("DUO Authentication Required");
  }
  async duoCallback(duoSignature) {
    //redirect to requested resource or fail
    if(this.DuoAuthService.getDuoState() === "STATE_AUTH_PASSED"){
      this.toastService.success("Succesfully Authenticated");
      
      let requestedPath = this.localStorageService.get("MFA_REQUEST");

      this.localStorageService.set("route-request", requestedPath);
      await this.UserService.login(duoSignature);

      this.$router.push({name: requestedPath});

    }
    else{
      this.toastService.error("Failed DUO Authentication");
    }

    
  }



}