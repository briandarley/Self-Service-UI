<template>
  <div class="container">
    <div class="card card-icon">
    <div class="card-header text-primary">
      <div class="icon bg-primary text-white">
        <i class="fab fa-hire-a-helper" aria-hidden="true"></i>
      </div>
      <h1>Help Desk Access</h1>
    </div>
    <div class="card-body">
      <div class="container">
        <tabbed-control tabs="Help Desk Users,Help Desk Postmasters,Help Desk Managers,MFA Reset, MFA Manage" >
          <tabbed-item slot="tab_0">
            <help-desk-role-management role-to-manage="ITS_WSP-Access-HelpdeskUsers"></help-desk-role-management>
          </tabbed-item>
          <tabbed-item slot="tab_1">
            <help-desk-role-management role-to-manage="ITS_WSP-Access-HelpdeskPostmasters"></help-desk-role-management>
          </tabbed-item>
          <tabbed-item slot="tab_2">
            <help-desk-role-management role-to-manage="ITS_WSP-Access-HelpdeskManagers"></help-desk-role-management>
          </tabbed-item>
          <tabbed-item slot="tab_3">
            <help-desk-role-management role-to-manage="ITS_WSP-Tools-MFA-Reset"></help-desk-role-management>
          </tabbed-item>
          <tabbed-item slot="tab_4">
            <help-desk-role-management role-to-manage="ITS_WSP-Tools-MFA-Manage"></help-desk-role-management>
          </tabbed-item>
        </tabbed-control>
        
      </div>

    </div>
  </div>
  </div>
</template>
<script src="./help-desk-access.js"></script>
<style lang="scss" src="./help-desk-access.scss" scoped></style>
