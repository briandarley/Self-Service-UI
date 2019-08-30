<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-mail-bulk"></i>
        </div>
        <h3>Systems Tools</h3>
      </div>
      <div class="card-body">
        <div class="border border-primary">
          <div class="alert alert-info">
            <div class="info flex-column">
              <i class="fa fa-info-circle"></i>
            </div>
            <div>
              <p>The tools listed in this section provides functionality for second level support.</p>
              <ul>
                <li>Searching previous provisioning requests</li>
                <li>Creation of Shared Mailboxes</li>
                <li>Creation of Resource Mailboxes</li>
                <li>Managing Alias Authority options</li>
              </ul>
            </div>
          </div>

          <div class="user-actions">
            <div class="action">
              <router-link :to="{name: 'provision-status'}" class="btn btn-outline-primary">
                
                  <i class="fa fas fas fa-digital-tachograph"></i>
                  <span>Provision Status</span>
                
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'shared-mailbox'}" class="btn btn-outline-primary">
                
                  <i class="fa fas fas fa-mail-bulk"></i>
                  <span>Shared Mailbox</span>
                
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'resource-mailbox'}" class="btn btn-outline-primary">
                
                  <i class="material-icons">contact_mail</i>
                  <span>Resource Mailbox</span>
                
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'alias-authority'}" class="btn btn-outline-primary">
                
                  <i class="fa fas far fa-id-card"></i>
                  <span>Alias Authority</span>
                
              </router-link>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "systems",
  dependencies: ["$", "moment", "toastService", "spinnerService"],
  components: {}
  //components: { Users, Roles, TabbedControl, TabbedItem, AuditDistGroups, ScheduledTasks }
})
export default class Systems extends Vue {
  async mounted() {
    this.toastService.set(this);
  }
  async created() {
    //called before child views are mounted
  }
}
</script>
<style lang="scss" scoped>

.user-actions {
  width: 300px;
  margin: auto;
}
.action {
  a:hover {
    text-decoration: none;
  }

  .btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 10px;
    align-items: center;

    i {
      margin-right: 10px;
    }

    span {
      padding: 10px 0;
    }
  }
}
</style>
