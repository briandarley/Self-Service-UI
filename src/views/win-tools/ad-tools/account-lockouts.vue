<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fas fa-user-lock"></i>
        </div>
        <h3>Account Lockouts</h3>
      </div>
      <div class="card-body"></div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "account-lockouts",
  dependencies: ["$", "moment", "toastService", "spinnerService"],
  components: {}
  //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
})
export default class AccountLockouts extends Vue {
  async mounted() {
    this.toastService.set(this);
  }
  async created() {
    //called before child views are mounted
  }
}
</script>
<style lang="scss" scoped>
</style>
