<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="far fa-id-card"></i>
        </div>
        <h3>Alias Authority</h3>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-info-circle"></i>
          </div>
          <p>This tool may be used to manage aliases for users who are authorized to administor aliases.</p>
          <p>The listed users have all been assigned at least one domain to manage</p>
          <p>
            Admistrators may navigate to
            <router-link tag="a" :to="{name: 'aliases'}">(win-tools/exchange-tools/aliases)</router-link>in order to modify individual users aliases. The list of available aliases are dependent on what is assigned to the individual administrator.
          </p>
        </div>
        <div class="container">
          <!-- Search Criteria for users/domains -->
          <div class="border border-primary">
            <div class="bg bg-primary text-white p-2">Search Criteria</div>
            <div class="m-2">
              <div class="form-group">
                <label for>Onyen</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Onyen"
                  v-model="criteria.onyen"
                >
              </div>
              <div class="form-group">
                <label for>Domain</label>
                <select
                  name="domain-select"
                  id="domain-select"
                  class="form-control"
                  v-model="criteria.domain"
                >
                  <option>-select-</option>
                  <option
                    v-for="(item, index) in availableDomains"
                    :key="index"
                    :value="item.name"
                  >{{item.name}}</option>
                </select>
              </div>
              <div class="sumbit text-right">
                <button class="btn btn-primary mr-1" @click="search()">Search</button>
                <button class="btn btn-secondary" @click="clearCriteria()">Clear</button>
              </div>
            </div>
          </div>

          <!-- Button to display new user -->
          <div class="my-3 text-center">
            <button class="btn btn-primary" @click="showNewUser()">Add User</button>
          </div>

          <transition name="fade">
          <!-- Add New User Properties -->
          <div class="border border-primary add-new-user" v-if="newUser.visible">
            <div class="bg bg-primary text-white p-2">New User Properties</div>
            <div class="container mt-1">
              <div class="form-group">
                <label for="add-new-user-onyen">Onyen</label>
                <input type="text" name="add-new-user-onyen" class="form-control" placeholder="Onyen" v-model="newUser.onyen">
              </div>
              <div class="form-group">
                <label for>Domain</label>
                <select name="add-new-user-domain" id="add-new-user-domain" class="form-control" v-model="newUser.domain">
                    <option value="">-select domain-</option>
                    <option v-for="item in availableDomains" :key="item.domainName">{{item.domainName}}</option>

                </select>
              </div>
              <div class="sumbit text-right my-3">
                <button class="btn btn-primary mr-1" @click="addNewUser()">Add User</button>
                <button class="btn btn-secondary" @click="clearNewUser()">Clear</button>
              </div>
            </div>
          </div>
          </transition>
          <!-- User Domain Search Result -->

        <transition name="fade">
          <div class="user-alias-result" v-if="!newUser.visible">
            <div class="d-flex mt-3" style="justify-content:space-between" >
            <h3 class="text-primary">Total Records {{userSearchResult.totalRecords | formatNumber}}</h3>
            <pager
              :criteria="criteria"
              btn-count="5"
              :total-records="userSearchResult.totalRecords"
              v-on:indexChanged="indexChanged"
            ></pager>
          </div>

          <div class="container border border-primary mt-1">
            <div class="row bg-primary text-white row-header">
              <div class="col">Onyen</div>
              <div class="col"></div>
            </div>
            <div
              class="result-grid row"
              v-for="item in userSearchResult.entities"
              v-bind:key="item.listName"
            >
              <div class="container admin-onyen">
                <div class="col" v-if="item.onyen">{{item.onyen}}</div>
                <div class="col" v-else>Empty</div>
                <div class="col">
                  <a href="#" @click.prevent="removeAliasAdmin(item)" class="mr-5">
                    <i class="fa fa-trash-o mr-2"></i>

                    <span>delete</span>
                  </a>

                  <a href="#" @click.prevent="toggleShowDomains(item)">
                    <i
                      class="fa fa-angle-double-down more-info"
                      :class="{expanded: item.expanded, collapsed: item.expanded === false}"
                    ></i>
                  </a>
                </div>
              </div>
              <transition name="expand">
                <div
                  class="container mx-3 border border-secondary alias-domains"
                  v-if="item.expanded"
                >
                  <div class="row bg-secondary text-white row-header">
                    <div class="col">Domain</div>
                    <div class="col"></div>
                  </div>
                  <div class="row" v-for="(adminUserAlias, j) in item.adminAliases" :key="j">
                    <div class="col">{{adminUserAlias.domain}}</div>
                    <div class="col">
                      <a href="#" @click.prevent="removeAliasAdminDomain(item,adminUserAlias)">
                        <i class="fa fa-trash-o mr-2"></i>
                        <span>remove</span>
                      </a>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col add-domain">
                      <div class="form-group form-inline">
                        <label for class="mr-2">Domain</label>
                        <select name id class="form-control" v-model="item.newDomain">
                          <option value>-select-</option>
                          <option
                            v-for="(domain, j) in calculateAvailableDomains(item)"
                            :key="j"
                            :value="domain.domainName"
                          >{{domain.domainName}}</option>
                        </select>
                        <button
                          class="btn btn-primary form-control"
                          @click="addAuthorizedDomain(item)"
                        >Add</button>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
           
          <div class="mt-3">
            <pager
              :criteria="criteria"
              btn-count="5"
              :total-records="userSearchResult.totalRecords"
              v-on:indexChanged="indexChanged"
            ></pager>
          </div>
          </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./alias-authority.js"></script>
<style lang="scss" src="./alias-authority.scss" scoped></style>
