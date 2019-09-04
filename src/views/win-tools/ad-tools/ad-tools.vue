<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-project-diagram" aria-hidden="true"></i>
        </div>
        <h3>AD Tools</h3>
      </div>
      <div class="card-body">
        <div class="border border-primary">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>
                AD Tools provides functionality for help desk and administrator personnel to manage and monitor various Active Directory systems including
                retrieving AD organizational units, detail account information, recent account lockouts, and managing groups.
              </p>
            </div>
          </div>

          <div class="user-actions" role="menu">
            <div class="action" role="menuitem">
              <router-link :to="{name: 'organizational-units'}" class="btn btn-outline-primary">
                
                  <i class="fas fa-cubes" aria-hidden="true"></i>
                  <span>Organization Units</span>
                
              </router-link>
            </div>
            <div class="action" role="menuitem">
              <router-link :to="{name: 'account-info'}" class="btn btn-outline-primary">
                
                  <i class="fab fa-linode" aria-hidden="true"></i>
                  <span>Account Info</span>
                
              </router-link>
            </div>
            <div class="action" role="menuitem">
              <router-link :to="{name: 'account-lockouts'}" class="btn btn-outline-primary">
                
                  <i class="fas fa-user-lock" aria-hidden="true"></i>
                  <span>Account Lockouts</span>
                
              </router-link>
            </div>
            <div class="action" role="menuitem">
              <router-link :to="{name: 'ad-groups'}" class="btn btn-outline-primary">
                
                  <i class="fas fa-object-group" aria-hidden="true"></i>
                  <span>Groups</span>
                
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./ad-tools.js"></script>
<style lang="scss" src="./ad-tools.scss" scoped></style>
