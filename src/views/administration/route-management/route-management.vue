<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fas fa-network-wired"></i>
        </div>
        <h3>Route Management</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <!-- Search Criteria -->
          <div class="section">
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
                  />

                  <!-- <label for="route_id">Id</label>
                  <input
                    name="route_id"
                    id="route_id"
                    type="text"
                    class="form-control"
                    placeholder="Route Id"
                    v-model="model.routeId"
                  /> -->
                </div>
                <!-- <div class="form-group form-inline">
                  <label for="route_name">Name</label>
                  <input
                    name="route_name"
                    id="route_name"
                    type="text"
                    class="form-control"
                    placeholder="Route Name"
                    v-model="model.name"
                  />
                </div> -->
                <!-- <div class="form-group form-inline">
                  <label for="route_name">Role</label>
                  <input
                    name="role_contains"
                    id="role_contains"
                    type="text"
                    class="form-control"
                    placeholder="Role"
                    v-model="model.role"
                  />
                </div> -->
                <!-- <div class="form-group form-inline">
                  <label for="route_name">Parent Route Id</label>
                  <input
                    name="parent_route_id"
                    id="parent_route_id"
                    type="text"
                    class="form-control"
                    placeholder="Parent Route Id"
                    v-model="model.parentRouteId"
                  />
                </div> -->
                <!-- <div class="form-group form-inline">
                  <label for="route_name">Enabled</label>

                  <select name id class="form-control" v-model="model.enabled">
                    <option value></option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                </div> -->
                <!-- <div class="form-group form-inline">
                  <label for="route_name">Include Children</label>

                  <select name id class="form-control" v-model="model.includeChildren">
                    <option value></option>
                    <option value="true">true</option>
                    <option value="false">false</option>
                  </select>
                </div> -->
              </div>
              <div class="submit text-right">
                <button class="btn btn-primary mr-1" @click="search()">Search</button>
                <button class="btn btn-secondary" @click="clear()">Clear</button>
              </div>
            </div>

            <!-- Search Criteria -->
          </div>
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
                <div>
                  <div class="col">{{item.id}}</div>
                  <div class="col">{{item.name}}</div>
                  <div class="col">{{item.enabled | toEnabledDisabled}}</div>
                  <div class="col text-right">
                    <a href="#" @click.prevent="toggleShowChildren(item)">
                      <i
                        class="fa fa-angle-double-down more-info"
                        :class="{expanded: item.expanded, collapsed: item.expanded === false}"
                      ></i>
                    </a>
                  </div>
                  <div class="entity-details">
                    <transition name="expand">
                      <div class="entity-details-data" v-if="item.expanded">
                        <route-info :model="item" ></route-info>
                        
                      </div>
                    </transition>
                  </div>
                </div>
              </div>

              <!-- Record Results -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./route-management.js"></script>
<style lang="scss" src="./route-management.scss" scoped></style>
