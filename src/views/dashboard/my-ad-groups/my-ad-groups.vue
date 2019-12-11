<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">group_work</i>
        </div>
        <h3>My AD Groups</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <tabbed-control tabs="Assigned Groups,My Groups">
            <tabbed-item slot="tab_0">
              <div class="alert alert-info">
                <div class="info">
                  <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
                <div class="ml-4">
                  <p>The groups listed are groups in which you are identified as being a member of.</p>
                
                </div>
              </div>

              <div class="section">
                <div class="container mb-3" v-if="entities.length">
                  <h3 class="text-primary">Total {{entities.length | formatNumber}}</h3>

                  <div class="bg-primary text-white row-header">
                    <div class="col">Group Name</div>
                  </div>
                  <div class="list-container">
                    <div class="result-grid" v-for="item in entities" v-bind:key="item">
                      <div class="col">{{item}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </tabbed-item>
            <tabbed-item slot="tab_1">
              <div class="alert alert-info">
                <div class="info">
                  <i class="fa fa-info-circle" aria-hidden="true"></i>
                </div>
                <div class="ml-4">
                  <p>Groups listed here are identified as groups which you are listed as a manager of</p>
                  <p>Use the search field below to filter the list of groups.</p>
                  <p></p>
                </div>
              </div>

              <div class="form-group">
                <label for="groupName">Group Name</label>
                <input
                  type="text"
                  id="groupName"
                  class="form-control"
                  v-select-all
                  placeholder="group name like"
                  v-model="criteria.filterText"
                  v-on:keyup.13="search()"
                />
              </div>

              <div class="submit text-right">
                <button class="btn btn-primary mr-1" @click="search()">Search</button>
                <button class="btn btn-secondary" @click="clear()">Clear</button>
              </div>

              <group-management
                :criteria="criteria"
                :service="DashboardService"
                ref="groupManagment"
              ></group-management>
            </tabbed-item>
          </tabbed-control>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./my-ad-groups.js"></script>
<style lang="scss" src="./my-ad-groups.scss" scoped></style>
