<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-toolbox"></i>
        </div>
        <h3>Admin Tools</h3>
      </div>
      <div class="card-body">
        <div class="user-actions">
          <div class="action">
            <router-link :to="{name: 'change-list-owner'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="far fa-address-book"></i>
                <span>Change List Owner</span>
              </a>
            </router-link>
          </div>
          <div class="action">
            <router-link :to="{name: 'create-list'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="material-icons">create</i>
                <span>Create List</span>
              </a>
            </router-link>
          </div>
          <div class="action">
            <router-link :to="{name: 'delete-list'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="far fa-trash-alt"></i>
                <span>Delete List</span>
              </a>
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
