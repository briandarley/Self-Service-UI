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
        <div class="form-group">
          <label for>User Id</label>
          <input
            type="text"
            class="form-control"
            v-select-all
            v-model="filter"
            placeholder="onyen, pid, or email"
            v-on:keyup.13="search()"
          >
        </div>
        <div class="submit text-right">
          <button class="btn btn-primary mr-1" @click="search()">Search</button>
          <button class="btn btn-secondary" @click="clear()">Clear</button>
        </div>
        <transition name="fade">
          <div class="container" v-if="dataRetrievalSuccess">
            <tabbed-control tabs="Audit,Active Directory,Campus Directory,Office 365">
              <tabbed-item slot="tab_0">
                <div class="container">
                  <audit-info :data="ldapData"></audit-info>
                </div>
              </tabbed-item>
              <tabbed-item slot="tab_1">
                <div class="container">
                  <active-directory-info :data="adData"></active-directory-info>
                </div>
              </tabbed-item>
              <tabbed-item slot="tab_2">
                <div class="container">
                  <campus-directory-info :data="campusDirectoryData"></campus-directory-info>
                </div>
              </tabbed-item>
              <tabbed-item slot="tab_3">
                <div class="container">
                  <office-365-info :data="office365Data"></office-365-info>
                </div>
              </tabbed-item>
            </tabbed-control>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script src="./account-info.js"></script>
<style lang="scss" src="./account-info.scss"></style>
