import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'route-info',
    dependencies: ['$','moment','toastService','spinnerService'],
    props:['model']
  })

export default class RouteInfo extends Vue {
  
  async mounted() { 
    this.toastService.set(this);
  }
  
}

