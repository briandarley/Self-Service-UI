<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fas fa-network-wired" aria-hidden="true"></i>
        </div>
        <h1>Route Management</h1>
      </div>
      <div class="card-body">
        <div class="container">
          <!-- Search Criteria -->
          <form @submit.prevent.prevent class="section" role="form">
            <div class="search-criteria">
              <div class="header">Search Routes</div>
              <div class="search-criteria-fields">
                <div class="form-group">
                  <label for="route_filter">Filter</label>
                  <input
                    id="route_filter"
                    type="text"
                    class="form-control"
                    placeholder="Route Id, Name"
                    v-model="model.filter"
                    autocomplete="off"
                  />
                </div>
                <div class="d-flex">
                  <div class="form-group form-inline">
                    <input
                      type="checkbox"
                      id="chkIncludeChildren"
                      class="form-control"
                      :checked="model.includeChildren"
                      v-model="model.includeChildren"
                    />
                    <label for="chkIncludeChildren">Include Children?</label>
                  </div>
                  <div class="form-group form-inline">
                    <input
                      type="checkbox"
                      id="chkIncludeParents"
                      class="form-control"
                      :checked="model.includeParents"
                      v-model="model.includeParents"
                    />
                    <label for="chkIncludeParents">Include Parents?</label>
                  </div>
                </div>
              </div>
              <div class="submit d-flex justify-content-between">
                <div class="text-left d-flex-grow-1">
                  <button class="btn btn-primary" @click="$refs.confirmAddRoute.show()">Add Route</button>
                </div>
                <div class="text-right d-flex-grow-1">
                  <button class="btn btn-primary mr-1" @click="search()">Search</button>
                  <button class="btn btn-secondary" @click="clear()">Clear</button>
                </div>
              </div>
            </div>

            <!-- Search Criteria -->
          </form>
          <div class="section">
            <div class="container">
              <div class="row bg-primary text-white row-header">
                <div class="col">
                  <span>Id</span>
                </div>
                <div class="col">
                  <span>Name</span>
                </div>
                <div class="col">
                  <span>Enabled</span>
                </div>
                <div class="col"></div>
              </div>
              <!-- Header Cols -->
              <!-- Record Results -->
              <div class="result-grid row" v-for="(item, index) in entities" v-bind:key="index">
                <div v-if="item">
                  <div class="col">{{item.id}}</div>
                  <div class="col">{{item.name}}</div>
                  <div class="col">{{item.enabled | toEnabledDisabled}}</div>
                  <div class="col text-right">
                    <a href="#" @click.prevent="toggleShowChildren(item)">
                      <i
                        class="fa fa-angle-double-down more-info"
                        :class="{expanded: item.expanded, collapsed: item.expanded === false}"
                      ></i>
                       <span v-if="item.expanded">collapse</span>
                <span v-else>expand</span>
                    </a>
                  </div>
                  <div class="entity-details">
                    <transition name="expand">
                      <div class="entity-details-data" v-if="item.expanded">
                        <route-info :model="item" @routeUpdated="onRouteUpdated" @routeDeleted="onRouteDeleted"></route-info>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>
              <!-- Record Results -->

              <!-- Add New Route -->
              <confirm-dialog id="confirmAddRoute" ref="confirmAddRoute" width="900">
                <div slot="modal-title" class="text-white">Confirm: Add New Route</div>
                <div slot="modal-body">
                  <route-info :model="newRoute"></route-info>
                </div>
                <div slot="modal-footer">
                  <button class="btn btn-primary" @click="onConfirmAddRouteClick()">add entity</button>
                  <button class="btn btn-secondary" @click="onCancelAddRouteClick()">cancel</button>
                </div>
              </confirm-dialog>

              <!-- Add New Route -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./route-management.js"></script>
<style lang="scss" src="./route-management.scss" scoped></style>
