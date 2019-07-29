<template>
  <div>


  </div>
</template>
<script>
import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'lockouts',
    dependencies: ['$','moment','toastService','spinnerService']
    
  })

export default class Lockouts extends Vue {
  async mounted() { 
    this.toastService.set(this);
  }
  async created(){
     //called before child views are mounted
  }
}



</script>
<style lang="scss" scoped>
</style>
