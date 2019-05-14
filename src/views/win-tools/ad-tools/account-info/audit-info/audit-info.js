import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'audit-info',
    dependencies: ['$','moment','toastService','spinnerService'],
    props: ['data']  
    
  })

export default class AuditInfo extends Vue {

  async mounted() { 
    this.toastService.set(this);
  }
  
}

