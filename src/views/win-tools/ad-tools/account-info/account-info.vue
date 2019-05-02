<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fab fa-linode"></i>
        </div>
        <h3>Account Info</h3>
      </div>
      <div class="card-body">
          <div class="container">
              <tabbed-control tabs="Audit,Active Directory,Campus Directory,Office 365">
          <tabbed-item slot="tab_0">
            <div class="container">
              <h1>Audit here</h1>
            </div>
          </tabbed-item>
          <tabbed-item slot="tab_1">
            <div class="container">
              <h1>Active Directory Here</h1>
            </div>
          </tabbed-item>
          <tabbed-item slot="tab_2">
            <div class="container">
              <h1>Campus directory here...</h1>
            </div>

          </tabbed-item>
          <tabbed-item slot="tab_3">
            <div class="container">
              <h1>Office 365 here ... </h1>
            </div>

          </tabbed-item>
        </tabbed-control>

          </div>

      </div>
    </div>
  </div>
</template>
<script src="./account-info.js"></script>
<style lang="scss" src="./account-info.scss" scoped></style>
