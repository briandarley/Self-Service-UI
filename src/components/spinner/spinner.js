import Vue from "vue"
import {
  Component
} from "vue-property-decorator";

@Component({
  name: 'spinner',
  dependencies: ['$', 'spinnerService'],
  components: {},
  
})

export default class Spinner extends Vue {
  processing = false;
  
  showSpinner() {
    this.processing = true;
  }
  hideSpinner() {
    this.processing = false;
  }
  toggleSpinner() {
    this.processing = !this.processing;
  }

  created() {
    this.spinnerService.onToggleSpinner = this.toggleSpinner;
    this.spinnerService.onHideSpinner = this.hideSpinner;
    this.spinnerService.onShowSpinner = this.showSpinner;

  }

}