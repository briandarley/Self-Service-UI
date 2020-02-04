<template>
  <div class="container mt-5 mb-4" role="table">
    <div class="d-flex" style="justify-content:space-between">
      <h3 class="text-primary">Total {{entities.length | formatNumber}}</h3>
    </div>
    <!-- Header Cols -->
    <div class="bg-primary text-white row-header" role="row">
      <div class="col" role="columnheader">
        <span>Name</span>
      </div>
      <div class="col" role="columnheader">
        <span>Create Date</span>
      </div>
      <div class="col" role="columnheader"></div>
    </div>

    <!-- Record Results -->
    <div role="rowgroup">
      <div class="result-grid" v-for="(item, index) in entities" v-bind:key="index" role="row">
        <div class="record">
          <div class="record-info">
            <div class="col" role="cell">{{item.displayName}}</div>
            <div class="col" role="cell">{{item.whenCreated | formatDate}}</div>
            <div class="col" role="cell">
              <a href="#" @click.prevent="toggleUsers(item)" :aria-label="!item.showUsers? 'Click to expand group members': 'Click to collapse group members' ">
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
                    :service="service"
                  ></user-list-management>
                </tabbed-item>
                <tabbed-item slot="tab_1">
                  <manager-list-management
                    ref="groupManagers"
                    :group="item.samAccountName"
                    autoLoadEntities="true"
                    @controlLoaded="onManagerListLoaded(item)"
                    :service="service"
                  ></manager-list-management>
                </tabbed-item>
              </tabbed-control>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <!-- Record Results -->

    <div v-if="!entities.length && performedSearch">
      <div class="alert alert-warning">
        <div class="info">
          <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
        </div>
        <p class="my-4 pb-3">The search results returned no records.</p>
      </div>
    </div>
  </div>
</template>
<script src="./group-management.js"></script>
<style lang="scss" src="./group-management.scss" ></style>
