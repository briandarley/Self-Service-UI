<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-mail-bulk" aria-hidden="true"></i>
        </div>
        <h1>Exchange Tools</h1>
      </div>
      <div class="card-body">
        <div class="border border-primary">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>Exchange Tools provides functionality for provisioning, managing, and securing Office 365 accounts including managing of aliases, OWA resources and monitoring of compromised accounts.</p>
            </div>
          </div>

          <div class="user-actions" role="menu">
            <div class="action" role="menuitem">
              <router-link :to="{name: 'provisioning'}" class="btn btn-outline-primary">
                
                  <i class="material-icons" aria-hidden="true">email</i>
                  <span>Provisioning</span>
                
              </router-link>
            </div>
            <div class="action" role="menuitem">
              <router-link :to="{name: 'aliases'}" class="btn btn-outline-primary">
                
                  <i class="fa fas fa fa-user-circle-o" aria-hidden="true"></i>
                  <span>Aliases</span>
                
              </router-link>
            </div>
            <div class="action" role="menuitem">
              <router-link :to="{name: 'resources'}" class="btn btn-outline-primary">
              
                  <i class="material-icons" aria-hidden="true">ballot</i>
                  <span>Resources</span>
              
              </router-link>
            </div>
            <div class="action" role="menuitem">
              <router-link :to="{name: 'compromised-accounts'}" class="btn btn-outline-primary">
                
                  <i class="fa fas fas fa-skull-crossbones" aria-hidden="true"></i>
                  <span>Compromised Accounts</span>
                
              </router-link>
            </div>
            <div class="action" role="menuitem">
              <router-link :to="{name: 'mfa'}" class="btn btn-outline-primary">
                
                  <i class="material-icons" aria-hidden="true">verified_user</i>
                  <span>MFA</span>
                
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./exchange-tools.js"></script>
<style lang="scss" src="./exchange-tools.scss" scoped></style>
