import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'spinner',
  dependencies: ['$', 'spinnerService','EventBus'],
  props: ['allowServiceUpdate']


})

export default class Spinner extends Vue {
  processing = false;

  showSpinner() {
    this.processing = true;
    this.EventBus.emit("attach-scroll")
  }
  hideSpinner() {
    this.processing = false;
  }
  toggleSpinner() {
    this.processing = !this.processing;
  }
  mounted(){
    //moved logic to created as we want to allow properties
    //also, in the main app view, we don't want the service to control behavior because the spinner will show twice locking
    //the control of the page, so let's disable the service for the main app and for all other instances allow the spinner to be turned on and off via service
    
    if (this.allowServiceUpdate !== false && this.allowServiceUpdate !== "false") {
      this.spinnerService.onToggleSpinner = this.toggleSpinner;
      this.spinnerService.onHideSpinner = this.hideSpinner;
      this.spinnerService.onShowSpinner = this.showSpinner;
    }
    
    
  }
  
  

}