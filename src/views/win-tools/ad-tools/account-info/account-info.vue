<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fab fa-linode" aria-hidden="true"></i>
        </div>
        <h1>Account Info</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent.prevent role="form" ref="searchForm">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>Use the search function to retrieve summary of user's LDAP, AD, Campus Directory, and Office 365 profiles.</p>
            </div>
          </div>

          <div class="form-group">
            <div class="label-info">
              <label for="userId">Search (Onyen, PID, Email)</label>
              <span class="required">Required</span>
            </div>

            
            <input
              type="text"
              class="form-control"
              id="userId"
              v-select-all
              v-model="filter"
              placeholder="onyen, pid, or email"
              v-on:keyup.13="search()"
              data-validation="{'required': 'true', 'message': 'Search field required'}"
              ref="newAlias"
                  autocomplete="off"
            />
          </div>
          <div class="submit">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
        </form>
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
                  <div v-if="officeLoading">
                    Loading Office Data ...
                  </div>
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
