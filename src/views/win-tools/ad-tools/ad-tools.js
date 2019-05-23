import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'ad-tools',
    dependencies: ['$','moment','toastService','spinnerService'],
  
  
  })

export default class AdTools extends Vue {
  async mounted() { 
    this.toastService.set(this);
  }
  
}

