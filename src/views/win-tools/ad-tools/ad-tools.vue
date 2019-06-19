<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-project-diagram"></i>
        </div>
        <h3>
          AD Tools
        </h3>
      </div>
      <div class="card-body">
        <div class="border border-primary">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-info-circle"></i>
          </div>
          <p>
            AD Tools provides functionality for help desk and administrator personel to manage and monitor various Active Directory systems including 
            retrieving AD organizational units, detail account information, recent account lockouts, and managing groups.

          
          </p>
          
          
        </div>

        <div class="user-actions">
          <div class="action">
            <router-link :to="{name: 'organizational-units'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="fas fa-cubes"></i>
                <span>Organization Units</span>
              </a>
            </router-link>
          </div>
          <div class="action">
            <router-link :to="{name: 'account-info'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="fab fa-linode"></i>
                <span>Account Info</span>
              </a>
            </router-link>
          </div>
          <div class="action">
            <router-link :to="{name: 'account-lockouts'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="fas fa-user-lock"></i>
                <span>Account Lockouts</span>
              </a>
            </router-link>
          </div>
          <div class="action">
            <router-link :to="{name: 'ad-groups'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="fas fa-object-group"></i>
                <span>Groups</span>
              </a>
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
