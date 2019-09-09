import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'criteria',
    dependencies: ['$','moment','toastService','spinnerService'],
    props: ['aliasDomains','id']
  })

export default class Criteria extends Vue {
  criteria = {

  }
  
  async mounted() { 
    this.toastService.set(this);
  }
  

  search (){
    this.$emit('search', this.criteria);
  }

  clearCriteria(){
    this.criteria = {};
    this.$emit('search', this.criteria);
  }

  getControlId(label)
  {
    return label + this.id;
  }

}

