import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'create-request',
    dependencies: ['$','moment','toastService','spinnerService']
    
  })

export default class CreateRequest extends Vue {
  campaignId = null;
  async mounted() { 
    this.toastService.set(this);
    this.campaignId = this.$route.params.id;

    
  }
  async created(){
     //called before child views are mounted
  }
}

