<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-users-cog"></i>
        </div>
        <h3>Administration</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <tabbed-control
            tabs="MassMail Admin,Student Approvers,Employee Approvers"
          >
            <tabbed-item slot="tab_0">
              <help-desk-role-management role-to-manage="ITS_WSP-Access-MassMail-Administrators"></help-desk-role-management>
            </tabbed-item>
            <tabbed-item slot="tab_1">
              <help-desk-role-management role-to-manage="ITS_WSP-Access-MassMail-Approvers_Students"></help-desk-role-management>
            </tabbed-item>
            <tabbed-item slot="tab_2">
              <help-desk-role-management role-to-manage="ITS_WSP-Access-MassMail-Approvers_Employees"></help-desk-role-management>
            </tabbed-item>
            
          </tabbed-control>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./administration.js"></script>
<style lang="scss" src="./administration.scss" scoped></style>
