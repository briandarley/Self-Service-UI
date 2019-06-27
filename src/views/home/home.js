import Vue from "vue"
import { Component } from "vue-property-decorator";


@Component({
    name: 'home',
    dependencies: ['$','toastService','spinnerService']
  })

  export default class Home extends Vue {
    
    click(){
      
    }
   
    async mounted() {
      this.toastService.set(this);

   
      
  }
}


