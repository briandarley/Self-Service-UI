<template>
  <div>


  </div>
</template>
<script>
import Vue from "vue"
import { Component } from "vue-property-decorator";

@Component({
    name: 'lockouts',
    dependencies: ['$','moment','toastService','spinnerService','ScreenReaderAnnouncerService']
    
  })

export default class Lockouts extends Vue {
  async mounted() { 
    this.toastService.set(this);
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement("Win Tools - Active Directory - Lockouts");
  }
  
}



</script>
<style lang="scss" scoped>
</style>
