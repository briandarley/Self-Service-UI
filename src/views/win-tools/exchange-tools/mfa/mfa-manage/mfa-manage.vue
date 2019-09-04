<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">supervised_user_circle</i>
        </div>
        <h3>MFA Management</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <tabbed-control tabs="Modify Account,Disabled Accounts" @tabChange="tabChanged">
            <tabbed-item slot="tab_0">
              <mfa-modify-account ref="mfaModifyAccount"></mfa-modify-account>
              <!-- <mfa-modify-account></mfa-modify-account> -->
            </tabbed-item>
            <tabbed-item slot="tab_1">
              <mfa-disabled-accounts ref="mfaDisabledAccounts"></mfa-disabled-accounts>
            </tabbed-item>
          </tabbed-control>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./mfa-manage.js"></script>
<style lang="scss" src="./mfa-manage.scss" scoped></style>
