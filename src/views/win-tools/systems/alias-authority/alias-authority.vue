<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="far fa-id-card" aria-hidden="true"></i>
        </div>
        <h1>Alias Authority</h1>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </div>
          <div>
            <p>This tool may be used to manage aliases for users who are authorized to administer aliases.</p>
            <p>The listed users have all been assigned at least one domain to manage</p>
            <p>
              Administrators may navigate to
              <router-link tag="a" :to="{name: 'aliases'}">(win-tools/exchange-tools/aliases)</router-link>in order to modify individual users aliases. The list of available aliases are dependent on what is assigned to the individual administrator.
            </p>
          </div>
        </div>
        <div class="container">
          
          <!-- Button to display new user -->
          <!-- <div class="my-3 text-center">
            <button class="btn btn-primary" @click="showNewUser()">Add User</button>
          </div> -->
          <tabbed-control tabs="Alias Admins, Alias Domains" >
            <tabbed-item slot="tab_0">
              <user-list></user-list>
            </tabbed-item>
            <tabbed-item slot="tab_1">
              <alias-list :entities="aliasDomains"></alias-list>
            </tabbed-item>
          </tabbed-control>


          
          
          


          

         
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./alias-authority.js"></script>
<style lang="scss" src="./alias-authority.scss" ></style>
