<template>
  <div>
<h4 class="text-primary">Remedy 3701858, Allow a longer character limit </h4>

  </div>
</template>
<script>
import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'resource-mailbox',
    dependencies: ['$','moment','toastService','spinnerService'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class ResourceMailbox extends Vue {
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
