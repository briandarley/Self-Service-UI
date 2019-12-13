import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'search-criteria',
    dependencies: ['$','moment','toastService','spinnerService'],
    props : ['criteria']
  })

export default class SearchCriteria extends Vue {
  

  async mounted() { 
    this.toastService.set(this);


  }
  clear(){
    this.criteria.index = 0;
    this.$emit('clear');
  }
  search(){
    this.criteria.index = 0;
    this.$emit('search');
  }
  
}

