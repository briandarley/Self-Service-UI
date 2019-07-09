<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-mail-bulk"></i>
        </div>
        <h3>Exchange Tools</h3>
      </div>
      <div class="card-body">
        <div class="border border-primary">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <div>
              <p>Exchange Tools provides functionality for provisioning, managing, and securing Office 365 accounts including managing of aliases, OWA resources and monitoring of compromised accounts.</p>
            </div>
          </div>

          <div class="user-actions">
            <div class="action">
              <router-link :to="{name: 'provisioning'}">
                <a href="#" class="btn btn-outline-primary">
                  <i class="material-icons">email</i>
                  <span>Provisioning</span>
                </a>
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'aliases'}">
                <a href="#" class="btn btn-outline-primary">
                  <i class="fa fas fa fa-user-circle-o"></i>
                  <span>Aliases</span>
                </a>
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'resources'}">
                <a href="#" class="btn btn-outline-primary">
                  <i class="material-icons">ballot</i>
                  <span>Resources</span>
                </a>
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'compromised-accounts'}">
                <a href="#" class="btn btn-outline-primary">
                  <i class="fa fas fas fa-skull-crossbones"></i>
                  <span>Compromised Accounts</span>
                </a>
              </router-link>
            </div>

            <div class="action">
              <router-link :to="{name: 'mfa'}">
                <a href="#" class="btn btn-outline-primary">
                  <i class="material-icons">verified_user</i>
                  <span>MFA</span>
                </a>
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
