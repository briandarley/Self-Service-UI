<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">verified_user</i>
        </div>
        <h1>MFA</h1>
      </div>
      <div class="card-body">
        <div class="border border-primary">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </div>
          <div class="py-3">
            <p>Select MFA Reset to cycle MFA for a single account.</p>
            <p>Select MFA Management to apply an MFA exemption for selected account.</p>
          </div>
        </div>

        <div class="user-actions my-5">
          <div class="action">
            <router-link :to="{name: 'mfa-reset'}" class="btn btn-outline-primary">
              
                <i class="material-icons" aria-hidden="true">undo</i>
                <span>MFA Reset</span>
              
            </router-link>
          </div>
          <div class="action">
            <router-link :to="{name: 'mfa-manage'}" class="btn btn-outline-primary">
              
                <i class="material-icons" aria-hidden="true">supervised_user_circle</i>
                <span>MFA Management</span>
              
            </router-link>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./mfa.js"></script>
<style lang="scss" src="./mfa.scss" scoped></style>
