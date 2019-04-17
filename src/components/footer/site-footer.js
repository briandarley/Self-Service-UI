import Vue from "vue"
import { Component}  from "vue-property-decorator";

@Component({  })
export default class SiteFooter extends Vue {
  getYear(){
    return (new Date().getFullYear())
  }
  async mounted() {
    
  }
}

