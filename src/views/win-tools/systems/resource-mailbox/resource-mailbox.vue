<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">contact_mail</i>
        </div>
        <h1>Resource Mailbox</h1>
      </div>
      <div class="card-body">
        <div class="alert alert-warning">
          <div class="info">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div>
            <p class="my-4 p-2">
            Resource Mailbox creation has moved to 
                
                <router-link :to="{name: 'ad-groups'}" >
                
                <span>Win Tools/AD Tools/Groups</span>
              </router-link>

          </p>
          <p>
            Use the button 'Create New Group' to create a new resource mailbox
          </p>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>
<script src="./resource-mailbox.js"></script>
<style lang="scss" src="./resource-mailbox.scss" scoped></style>
