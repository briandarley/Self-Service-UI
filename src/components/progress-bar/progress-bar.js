import Vue from "vue"
import { Component } from "vue-property-decorator";
// , Prop, Watch
@Component({
    name: 'progress-bar'
  })

export default class ProgressBar extends Vue {
  width = 0;
  statusText = "";

  updateStatus(model){
    let amount = model ? model.amount : undefined;
    this.statusText = model? model.statusText : "";
    


    if(amount != undefined){
      this.width = amount;
      return;
    }
    if(this.width === 100){
      this.width = 0;
    }
    else{
      this.width += 10;
    }
  }

  async mounted() { 
    //child views are 'mounted' before parent is 'mounted' 
  }
  async created(){
     //called before child views are mounted
  }
}

