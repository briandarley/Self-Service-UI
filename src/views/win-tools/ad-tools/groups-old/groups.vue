<template>
  <div class="container group-management">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fas fa-object-group" aria-hidden="true"></i>
        </div>
        <h1>Active Directory Groups</h1>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>
                Use the search field below to locate a desired record using
                Onyen
              </p>
              <p>
                Note only one field is required when searching for desired
                groups. You do not need to specify both fields when searching.
                Searching by group name utilizes like expressions. So entering
                'test' will return 'ipsum_lorem_test', 'delorem_cdstest mailbox
                full access', 'its_foshizzletestdg.dg' for example.
              </p>
            </div>
          </div>
          <div class="border border-primary search-criteria">
            <div class="bg bg-primary text-white p-2">Search Criteria</div>
            <div class="m-2">
              <div class="row-1">
                <div class="form-group">
                  <label for="managedBy">Managed By</label>
                  <input
                    type="text"
                    id="managedBy"
                    class="form-control"
                    v-select-all
                    placeholder="onyen, pid, email"
                    v-model="criteria.managedBy"
                    v-on:keyup.13="search()"
                  />
                </div>
              </div>
              <div class="row-2">
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
              </div>
              <div class="submit text-right">
                <button class="btn btn-primary mr-1" @click="search()">
                  Search
                </button>
                <button class="btn btn-secondary" @click="clear()">
                  Clear
                </button>
              </div>
            </div>
          </div>

          <group-management
            :criteria="criteria"
            :service="ExchangeToolsService"
            requireCriteria="true"
            ref="groupManagment"
          ></group-management>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./groups.js"></script>
<style lang="scss" src="./groups.scss"></style>
