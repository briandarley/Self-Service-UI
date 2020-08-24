<template>
  <div class="container group-management">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-object-group"></i>
        </div>
        <h1>Search Groups</h1>
      </div>
      <div class="card-body">
        <div class="alert alert-info" v-if="!hideInfo">
          <div class="info">
            <i class="fas fa-info-circle"></i>
          </div>

          <div class="p-2">
            <p>
              Use the search field below to locate a desired record using Onyen
            </p>

            <p>
              Note only one field is required when searching for desired groups.
              You do not need to specify both fields when searching. Searching
              by group name utilizes like expressions. So entering 'test' will
              return 'ipsum_lorem_test', 'delorem_cdstest mailbox full access',
              'its_foo_bartestdg.dg' for example.
            </p>
            <p>
              Use the appropriate links to update users and managers of the
              specific group. Manager link will be disabled if no valid manager
              is listed or if group is a Grouper or Posix group.
            </p>
            <p>
              Use the 'Create New Group' button to create either a shared
              mailbox or resource mailbox
            </p>
          </div>
          <div class="align-self-start">
            <a href="#" @click.prevent="hideInfo = true"
              ><i class="fa fa-times"></i
            ></a>
          </div>
        </div>

        <div class="my-3 submit text-right">
          <button class="btn btn-primary ml-1 btn-sm" @click="createNewGroup()">
            Create New Group
          </button>
        </div>

        <div class="border border-primary search-criteria border-top-0">
          <div class="bg bg-primary text-white p-2">Search Criteria</div>
          <div class="m-2">
            <div class="row-1">
              <div class="row-1">
                <label
                  >Departmental Unit Abbreviation (i.e. ITS, DSA, FPG)</label
                >
                <type-ahead
                  id="thSelectDepartment"
                  placeHolder="select organization"
                  :label="'Departmental Unit Abbreviation (i.e. ITS, DSA, FPG)'"
                  ref="thSelectDepartment"
                  :dataOptions="thDataOptions"
                  @change="onDepartmentalUnitChange"
                ></type-ahead>
              </div>
            </div>
            <div class="row-1">
              <div class="d-flex ">
                <div class="form-group w-50">
                  <label for="managedBy">Managed By</label>
                  <input
                    type="text"
                    id="managedBy"
                    class="form-control"
                    v-select-all
                    placeholder="onyen, pid, email"
                    autocomplete="off"
                    v-model="criteria.managedBy"
                    v-on:keyup.13="search()"
                  />
                </div>
                <div class="form-group  w-50 " :class="{'d-flex' : criteria.userMemberOf}">
                  <div>
                    <label for="managedBy"
                      >Member Of (Groups in which user is member of)</label
                    >
                    <input
                      type="text"
                      id="memberOf"
                      class="form-control"
                      v-select-all
                      placeholder="onyen, pid, email"
                      v-model="criteria.userMemberOf"
                      autocomplete="off"
                      v-on:keyup.13="search()"
                    />
                  </div>

                  <div class="align-self-center flex-grow-1" v-if="criteria.userMemberOf">
                    <div class="custom-control custom-checkbox text-center" >
                      <input
                        type="checkbox"
                        id="chkUserMemberOfNested"
                        class="custom-control-input"
                        :checked="criteria.userMemberOfNested"
                        v-model="criteria.userMemberOfNested"
                      />
                      <label
                        for="chkUserMemberOfNested"
                        class="font-weight-bolder text-primary custom-control-label"
                        >Include Parents?</label
                      >
                    </div>
                  </div>
                </div>
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
                  autocomplete="off"
                  v-model="criteria.filterText"
                  v-on:keyup.13="search()"
                />
              </div>
            </div>
            <div class="submit text-right">
              <button class="btn btn-primary mr-1" @click="search($event)">
                Search
              </button>
              <button class="btn btn-secondary" @click="clear()">
                Clear
              </button>
            </div>
          </div>
        </div>

        <div class="mt-3" v-if="pagedResponse.totalRecords">
          <!-- <div class="bg bg-primary text-white p-2">Search Results</div> -->

          <div class="d-flex mt-5" style="justify-content:space-between">
            <h3 class="text-primary">
              Total Groups {{ pagedResponse.totalRecords | formatNumber }}
            </h3>
            <pager
              :criteria="criteria"
              btn-count="5"
              :total-records="pagedResponse.totalRecords"
              v-on:indexChanged="indexChanged"
            ></pager>
          </div>

          <!--Trigger-->
          <div class="search-result">
            <div class="bg-primary text-white row-header">
              <div><a href="#" @click.prevent="sort('name')">Name</a></div>
              <div>
                <a href="#" @click.prevent="sort('whenCreated')"
                  >When Created</a
                >
              </div>
              <div>Security Group</div>
              <!-- 
                <div>Members</div>
                <div>Editable</div> 
            -->
              <div class="control">Action</div>
            </div>
            <div class="results">
              <div
                class="result-grid"
                v-for="item in pagedResponse.entities"
                :key="item.displayName"
              >
                <div class="record-info">
                  <div>{{ item.name }}</div>
                  <div>{{ item.whenCreated | formatDate }}</div>
                  <div>{{ item.isSecurityGroup ? "Y" : "N" }}</div>

                  <div>
                    <a
                      href="#"
                      @click.prevent="manageMembers(item)"
                      class="mr-2"
                      >Members</a
                    >
                    <a
                      href="#"
                      @click.prevent="manageManagers(item)"
                      v-if="editManagersEnabled(item)"
                      >Managers</a
                    >
                    <span v-else class="text-secondary">Managers</span>
                  </div>
                </div>
                <!-- <div class="group-description">{{item.description}}</div> -->
              </div>
            </div>
          </div>

          <div class="d-flex mt-2" style="justify-content:space-between">
            <div></div>
            <pager
              :criteria="criteria"
              btn-count="5"
              :total-records="pagedResponse.totalRecords"
              v-on:indexChanged="indexChanged"
            ></pager>
          </div>
        </div>
        <div class="mt-5" v-else>
          <div class="alert alert-warning">
            <div class="info">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div>
              <p class="my-4 p-2">
                No results, enter criteria to search upon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./group-search.js"></script>
<style lang="scss" src="./group-search.scss"></style>
