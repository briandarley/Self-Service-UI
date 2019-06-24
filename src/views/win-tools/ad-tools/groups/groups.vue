<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fas fa-object-group"></i>
        </div>
        <h3>Active Directory Groups</h3>
      </div>
      <div class="card-body">
        <h4 class="text-primary">Remedy 3891776, allow users to use any e-mail to look-up persons</h4>

        <h4
          class="text-primary"
        >Remedy 3701860, combine group functionality into one UI, provide better search functionality</h4>

        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <p>
              The accounts listed have been identified by AD as being locked. A Window's Event was triggered and this event was submitted to Splunk.
              We attempt to retrieve the machine name whenever possible but there are times when this value is not available.
            </p>
            <p>Use the search field below to locate a desired record using Onyen</p>
          </div>

          <div class="form-group">
            <label for>Managed By</label>
            <input
              type="text"
              class="form-control"
              v-select-all
              placeholder="onyen, pid, email"
              v-model="criteria.managedBy"
              v-on:keyup.13="search()"
            >
          </div>
          <div class="form-group">
            <label for>Group Name</label>
            <input
              type="text"
              class="form-control"
              v-select-all
              placeholder="group name like"
              v-model="criteria.filterText"
              v-on:keyup.13="search()"
            >
          </div>

          <div class="submit text-right" :class="{'mb-4': !records.length}">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
          <div v-if="records.length > 0">
            <div class="container mt-5 mb-4">
              <div class="d-flex" style="justify-content:space-between">
                <h3 class="text-primary">Total {{records.length | formatNumber}}</h3>
              </div>
              <!-- Header Cols -->
              <div class="row bg-primary text-white row-header">
                <div class="col">
                  <span>Name</span>
                </div>
                <div class="col">
                  <span>Create Date</span>
                </div>
                <div class="col"></div>
              </div>
              <!-- Header Cols -->

              <!-- Record Results -->

              <div class="result-grid row" v-for="(item, index) in records" v-bind:key="index">
                <div class="record">
                  <div class="record-info">
                    <div class="col">{{item.displayName}}</div>
                    <div class="col">{{item.whenCreated | formatDate}}</div>
                    <div class="col">
                      <a href="#" @click.prevent="toggleUsers(item)">
                        <i
                          class="fa fa-angle-double-down more-info"
                          :class="{expanded: item.showUsers, collapsed: item.showUsers === false}"
                        ></i> Members
                      </a>
                    </div>
                  </div>

                  <transition name="expand">
                    <div class="group-users" v-if="item.showUsers">
                      <tabbed-control tabs="Members,Managers">
                        <tabbed-item slot="tab_0">
                          <user-list-management
                            ref="groupUsers"
                            :group="item.samAccountName"
                            autoLoadEntities="true"
                            @controlLoaded="onGroupUserListLoaded(item)"
                          ></user-list-management>
                        </tabbed-item>
                        <tabbed-item slot="tab_1">
                          <manager-list-management
                            ref="groupManagers"
                            :group="item.samAccountName"
                            autoLoadEntities="true"
                            @controlLoaded="onManagerListLoaded(item)"
                          ></manager-list-management>
                        </tabbed-item>
                      </tabbed-control>
                    </div>
                  </transition>
                </div>
              </div>

              <!-- Record Results -->
            </div>
          </div>
          <div v-if="!records.length && performedSearch">
            <div class="alert alert-warning">
              <div class="info">
                <i class="fa fa-exclamation-circle"></i>
              </div>
              <p class="my-4 pb-3">The search results returned no records.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./groups.js"></script>
<style lang="scss" src="./groups.scss" ></style>
