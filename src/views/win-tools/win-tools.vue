<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-windows"></i>
        </div>
        <h3>Win Tools</h3>
      </div>
      <div class="card-body">
        <div class="border border-primary">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <div>
              <p>WinTools offers tools for administrator and help desk users. Tools that help manage user mailboxes, provisioning email, managing email aliases, and monitor account information.</p>
            </div>
          </div>

          <div class="user-actions">
            <div class="action">
              <router-link :to="{name: 'exchange-tools'}">
                <a href="#" class="btn btn-outline-primary">
                  <i class="fa fas fas fa-mail-bulk"></i>
                  <span>Exchange Tools</span>
                </a>
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'ad-tools'}">
                <a href="#" class="btn btn-outline-primary">
                  <i class="fa fas fas fa-project-diagram"></i>
                  <span>AD Tools</span>
                </a>
              </router-link>
            </div>
            <div class="action">
              <router-link :to="{name: 'systems'}">
                <a href="#" class="btn btn-outline-primary">
                  <i class="fa fas fas fa-network-wired"></i>
                  <span>Systems</span>
                </a>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./win-tools.js"></script>
<style lang="scss" src="./win-tools.scss" scoped></style>
