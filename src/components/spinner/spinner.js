import Vue from "vue"
import {
  Component,Watch
} from "vue-property-decorator";

@Component({
  name: 'spinner',
  dependencies: ['$', 'spinnerService','EventBus','CommonExtensions'],
  props: ['allowServiceUpdate','id']


})

export default class Spinner extends Vue {
  processing = false;

  showSpinner() {
    let $ = this.$;
    this.processing = true;
    this.EventBus.emit("attach-scroll")

    let el = $(`#${this.id}`);
    let appSection = $($(".app-section")[0]);
    let wrapper = $(el.parents(".simplebar-content-wrapper")[0]);
    let viewHeight = appSection.height();
    let offSet = wrapper.scrollTop();
    


    el.height(viewHeight + offSet );
    

    //execute every 100ms, then stop after 1sec
    let handle = setInterval(() => {
      
         viewHeight = appSection.height();
         offSet = wrapper.scrollTop();

        el.height(viewHeight + offSet );
      
    }, 100)

    setTimeout(() => {
      clearInterval(handle)
    }, 1000);


    
    // let el = $(`#${this.id}`);
    // window.console.log($(el))
    
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
    //this.id = this.CommonExtensions.uuid4();
    if (this.allowServiceUpdate !== false && this.allowServiceUpdate !== "false") {
      this.spinnerService.onToggleSpinner = this.toggleSpinner;
      this.spinnerService.onHideSpinner = this.hideSpinner;
      this.spinnerService.onShowSpinner = this.showSpinner;
    }
    
    
  }
  
  

}