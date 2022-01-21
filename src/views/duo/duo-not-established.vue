<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">undo</i>
        </div>
        <h1>Duo Not Registered</h1>
      </div>
      <div class="card-body">
        <div class="alert alert-warning">
          <div class="info text-warning">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
          </div>
          <div>
            <h2 class="h5 text-secondary strong">
              Duo Is Required to access this resource
            </h2>
            <p></p>
          </div>
        </div>

        <div class="container">
          <p>
            It appears you don't have DUO registered. The resource you are
            attempting to access requires DUO authentication.
          </p>

          <p>
            You may call (919) 962-HELP or Toll-Free from US
            and Puerto Rico: (866) 962-4457, for personal assistance with your
            computing problem.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component({
  name: "duo-not-established",
  dependencies: ["$", "moment", "toastService", "spinnerService"],
  components: {},
  //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
})
export default class DuoNotEstablished extends Vue {
  async mounted() {
    this.toastService.set(this);
  }
  async created() {
    //called before child views are mounted
  }
}
</script>
<style lang="scss" scoped></style>
