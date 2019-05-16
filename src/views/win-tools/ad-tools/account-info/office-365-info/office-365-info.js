import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'office-365-info',
    dependencies: ['$','moment','toastService','spinnerService'],
    props: ['data']
    
  })

export default class Office365Info extends Vue {
  async mounted() { 
    this.toastService.set(this);
  }
  
}

