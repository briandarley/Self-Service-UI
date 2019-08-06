import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
  name: 'duo',
  dependencies: ['$', 'moment', 'toastService', 'spinnerService', 'DuoAuthService','localStorageService']
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
  }
  async duoCallback() {
    //redirect to requested resource or fail
    if(this.DuoAuthService.getDuoState() === "STATE_AUTH_PASSED"){
      this.toastService.success("Succesfully Authenticated");
      
      let requestedPath = this.localStorageService.get("MFA_REQUEST");
      this.$router.push({name: requestedPath});

    }
    else{
      this.toastService.error("Failed DUO Authentication");
    }

    
  }



}