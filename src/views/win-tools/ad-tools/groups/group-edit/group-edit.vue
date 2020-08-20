<template>
  <div class="container group-management">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-object-group"></i>
        </div>
        <h1>Group Edit, {{groupName}}</h1>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
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

            
          </div>
        </div>
        <div class="d-flex justify-content-between my-3">
          <div>
            <button
              type="button"
              class="btn btn-primary ml-1"
              @click="goToGroupSearch()"
            >
              <i class="fa fa-angle-left mr-1"></i>
              Back to Group Search
            </button>

            <button
              type="button"
              class="btn btn-primary ml-1"
              @click="goToGroupManagers()"
            >
              <i class="fa fa-angle-right mx-1"></i>
              Edit Group Managers
            </button>

          </div>
          <div>
            <button class="btn btn-danger mr-2">
              <i class="fa fa-trash-o mr-1"></i>
              Delete Group
            </button>
            <button class="btn btn-primary">
              <i class="fa fa-plus-circle mr-1"></i>
              Add Member
            </button>
          </div>
        </div>

        <div class="border border-primary search-criteria">
          <div class="bg bg-primary text-white p-2">Search Criteria</div>
          <div class="m-2">
            <div class="row-1">
              <div class="row-1"></div>
            </div>
            <div class="row-1">
              <div class="form-group">
                <label for="managedBy">Member Id</label>
                <input
                  type="text"
                  id="memberId"
                  class="form-control"
                  v-select-all
                  placeholder="onyen, pid, email, sam account name"
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

<div
        class="ml-3 pt-2 custom-control custom-checkbox "
        
      >
        <input type="checkbox" id="chkRecursive" class="custom-control-input" v-model="criteria.recursiveSearch" @change="search()"  />
        <label
          for="chkRecursive"
          class="font-weight-bolder text-primary custom-control-label"
          >Recursive Lookup? (List members within groups, slower)</label
        >
      </div>

        <div class="mt-3">
          <!-- <div class="bg bg-primary text-white p-2">Search Results</div> -->

          <div class="d-flex mt-5" style="justify-content:space-between">
            <h3 class="text-primary">
              Total #Members {{ pagedResponse.totalRecords | formatNumber }}
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
              <div>
                <a href="#" @click.prevent="sort('cn')"
                  >CN</a
                >
              </div>
              <div>
                <a href="#" @click.prevent="sort('samAccountName')"
                  >User Id</a
                >
              </div>
              <div><a href="#" @click.prevent="sort('mail')">Email</a></div>
              <div>
                <a href="#" @click.prevent="sort('employeeId')">Employee Id</a>
              </div>
              <div>
                <a href="#" @click.prevent="sort('objectClass')">Type</a>
              </div>
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
                :key="item.distinguishedName"
              >
                <div class="record-info">
                  <div>{{ item.cn | filterCn }}</div>
                  <div>{{ item.samAccountName }}</div>
                  <div>{{ item.mail }}</div>
                  <div>{{ item.employeeId }}</div>
                  <div>{{ item.objectClass }}</div>

                  <div>
                    <a
                      href="#"
                      @click.prevent="expand(item)"
                      v-if="item.objectClass === 'group'"
                      class="mr-3"
                      >Edit Group</a
                    >

                    <a href="#" @click.prevent="removeMember(item)">Remove</a>
                  </div>
                </div>
                <!-- <div v-if="item.objectClass == 'contact'">{{item}}</div> -->
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
      </div>
    </div>
  </div>
</template>
<script src="./group-edit.js"></script>
<style lang="scss" src="./group-edit.scss"></style>
