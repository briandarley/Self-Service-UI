<template>
  <div>
<h4 class="text-primary">Remedy 3701855, Allow a longer character limit </h4>

<p>
Allow a longer character limit (Currently 15 or 23 with the UNC prefix), the UNC prefix can take up to 7 characters, thus limiting the number of characters that can be used for the name. The current character limit is based on the longest possible prefix.

Create shared mailboxes in the cloud. Currently mailboxes are created on-prem, and those have to be migrated to 365 after a DirSync cycle has occured. Creating them in 365 initially would save time.
  </p>

  </div>
</template>
<script>
import Vue from "vue"
import { Component, Watch } from "vue-property-decorator";

@Component({
    name: 'shared-mailbox',
    dependencies: ['$','moment','toastService','spinnerService'],
    components:{}
    //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
  })

export default class SharedMailbox extends Vue {
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
