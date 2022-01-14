<template>
  <div class="container" autocomplete="off">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fas fa-mail-bulk" aria-hidden="true"></i>
        </div>
        <h1>Shared Mailbox</h1>
      </div>
      <div class="card-body">
        

 
        <div class="alert alert-warning">
          <div class="info">
            <i class="fas fa-exclamation-circle"></i>
          </div>
         <div>
            <p class="my-4 p-2">
            Shared Mailbox creation has moved to 
                
                <router-link :to="{name: 'ad-groups'}" >
                
                <span>Win Tools/AD Tools/Groups</span>
              </router-link>

          </p>
          <p>
            Use the button 'Create New Group' to create a new shared mailbox
          </p>
         </div>
        </div>



      </div>
    </div>
  </div>
</template>
<script src="./shared-mailbox.js"></script>
<style lang="scss" src="./shared-mailbox.scss" scoped></style>
