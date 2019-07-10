import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'administration',
    dependencies: ['$','moment','toastService','spinnerService','AdministrationService']
  })

export default class Administration extends Vue {
  async mounted() { 
    this.toastService.set(this);
  }

}

