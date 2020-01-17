<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-toolbox" aria-hidden="true"></i>
        </div>
        <h1>Admin Tools</h1>
      </div>
      <div class="card-body">
        <div class="user-actions" role="menu">
          <div class="action" role="menuitem">
            <router-link :to="{name: 'change-list-owner'}" class="btn btn-outline-primary">
                <i class="far fa-address-book" aria-hidden="true"></i>
                <span>Change List Owner</span>
            </router-link>
          </div>
          <div class="action" role="menuitem">
            <router-link :to="{name: 'create-list'}" class="btn btn-outline-primary">
                <i class="material-icons" aria-hidden="true">create</i>
                <span>Create List</span>
            </router-link>
          </div>
          <div class="action" role="menuitem">
            <router-link :to="{name: 'delete-list'}" class="btn btn-outline-primary">
              <i class="far fa-trash-alt" aria-hidden="true"></i>
                <span>Delete List</span>
            </router-link>
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
  name: "admin-tools"
})
export default class AdminTools extends Vue {
 
}
</script>
<style lang="scss"  scoped>

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
