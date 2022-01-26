<template>
  <div class="container group-managers">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-object-group"></i>
        </div>
        <h1>Group Managers</h1>
        <div></div>
        <div class="group-info">
          <div>
            <span>SamAccountName: </span>
            <span>{{ groupName }}</span>
          </div>
          <div>
            <span>DN: </span>
            <span>{{ groupDetail.distinguishedName }}</span>
          </div>
          <div>
            <span>Description: </span>
            <span>{{ groupDetail.description }}</span>
          </div>
          <div v-if="groupDetail.memberOf && groupDetail.memberOf.length">
            <span>
              Member Of:
            </span>
            <span>
              {{ groupDetail.memberOf.length }} groups,
              <a href="#" @click.prevent="goToGroupSearch({ parentsOf: true })"
                >View Inherited Groups</a
              >
            </span>
          </div>
        </div>
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
          </div>
          <div class="align-self-start">
            <a href="#" @click.prevent="hideInfo = true"
              ><i class="fa fa-times"></i
            ></a>
          </div>
        </div>
<div class="mt-3 border border-primary mx-2" v-if="canAddManager && showAddManager">
              <h6 class="p-1 bg-primary text-white">Add Group Manager</h6>
              <div class="add-meber pr-3 d-flex">
                <div class="form-group w-75 d-flex">
                  <label
                    for="memberId-search"
                    class="w-25 text-right pr-2 pt-1 align-self-center"
                    >User Id</label
                  >
                  <input
                    type="text"
                    id="memberId-search"
                    name="memberId-search"
                    class="form-control "
                    v-select-all
                    placeholder="entity Id, (Onyen, PID,Email, SamAccountName)"
                    v-model="modelSearch.filterText"
                    v-on:keyup.13="lookupUser()"
                    autocomplete="off"
                  />
                </div>
                <div class="w-25 text-right">
                  <button
                    type="button"
                    class="btn btn-primary mr-1"
                    @click="lookupUser()"
                  >
                    <i class="fa fa-search small mr-1"></i>
                    Lookup
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="resetSearch()"
                  >
                    <i class="fa fa-trash small mr-1"></i>
                    Clear
                  </button>
                </div>
              </div>

              <div v-if="adUser.cn">
                <div class="search-result m-3">
                  <div class="bg-primary text-white row-header">
                    <div>
                      CN
                    </div>
                    <div>
                      User Id
                    </div>
                    <div>
                      Email
                    </div>

                    <div>
                      Employee Id
                    </div>
                  </div>
                  <div class="record-info">
                    
                      <div>{{ adUser.cn | filterCn }}</div>
                      <div>{{ adUser.samAccountName }}</div>

                      <div>{{ adUser.mail }}</div>
                      <div>{{ adUser.employeeId }}</div>

                      
                    
                  </div>
                </div>

                <div class="text-right m-3">
                  <button
                    class="btn btn-primary mr-2"
                    @click="addToManagerList()"
                  >
                    Add Entity
                  </button>
                  <button class="btn btn-secondary" @click="resetSearch()">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        <div class="d-flex justify-content-between my-3">
          <div>
            <button
              type="button"
              class="btn btn-primary ml-1 btn-sm"
              @click="goToGroupSearch()"
            >
              <i class="fa fa-angle-left mr-1"></i>
              Back to Group Search
            </button>

            <button
              type="button"
              class="btn btn-primary ml-1 btn-sm"
              @click="goToGroupMembers()"
            >
              <i class="fa fa-angle-right mx-1"></i>
              Edit Group Members
            </button>
          </div>
          <div v-if="!this.locked">
            <!-- <button class="btn btn-danger mr-2" @click="verifyDeleteGroup()">
              <i class="fa fa-trash-o mr-1"></i>
              Delete Group
            </button> -->
            <button
              class="btn btn-primary btn-sm"
              @click="showAddManager = !showAddManager"
              :disabled="!canAddManager"
            >
              <i class="fa fa-plus-circle mr-1"></i>
              Add Manager
            </button>
          </div>
        </div>

        <div class="mt-3">
          <!-- <div class="bg bg-primary text-white p-2">Search Results</div> -->

          <!--Trigger-->
          <div>
            <div class="search-result" v-if="groupManagers.length">
              <div class="bg-primary text-white row-header">
                <div>
                  <a href="#" @click.prevent="sort('cn')">CN</a>
                </div>
                <div>
                  <a href="#" @click.prevent="sort('samAccountName')"
                    >User Id</a
                  >
                </div>
                <div><a href="#" @click.prevent="sort('mail')">Email</a></div>
                <div>
                  <a href="#" @click.prevent="sort('employeeId')"
                    >Employee Id</a
                  >
                </div>
                
                <div class="control">Action</div>
              </div>
              <div class="results">
                <div
                  class="result-grid"
                  v-for="item in groupManagers"
                  :key="item.distinguishedName"
                >
                  <div class="record-info">
                    <div>{{ item.cn | filterCn }}</div>
                    <div>{{ item.samAccountName }}</div>
                    <div>{{ item.mail }}</div>
                    <div>{{ item.employeeId }}</div>


                    <div>
                      
                      <a href="#" @click.prevent="removeMember(item)">Remove</a>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
            <div v-else>
              <div class="alert alert-danger" v-if="this.locked">
                <div class="info">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
                <div>
                  <p class="my-4 p-2">
                    Group editing is not permitted because of one of the bellow
                    conditions are not met
                  </p>
                  <ul>
                    <li>You're not listed as manager of group</li>
                    <li>SelfService is not listed as manager of group</li>
                    <li>
                      Group should not be modified outside of Grouper or Posix
                    </li>
                  </ul>
                </div>
              </div>
              <div class="alert alert-warning" v-else>
                <div class="info">
                  <i class="fas fa-exclamation-circle"></i>
                </div>
                <div>
                  <p class="mt-2 pt-2">
                    No managers listed for group. Use input fields to add a new
                    manager
                  </p>
                  <p v-if="!groupDetail.isExchangeGroup">
                    Note, only one manager allowed for this group type
                  </p>
                </div>
              </div>
            </div>

            
            
          </div>
        </div>
      </div>
    </div>

    <confirm-dialog id="confirmAddManager" ref="confirmAddManager" width="800">
      <div slot="modal-title" class="text-white">
        Add Group Manager
      </div>
      <div slot="modal-body"></div>
    </confirm-dialog>

    <confirm-dialog
      id="confirmRemoveMailbox"
      ref="confirmRemoveMailbox"
      width="800"
    >
      <div slot="modal-title" class="text-white">
        Remove Associated Mailbox?
      </div>
      <div slot="modal-body">
        <div class="alert alert-warning">
          <div class="info">
            <i class="fas fa-question-circle"></i>
          </div>
          <p class="my-4 p-2">
            Remove group along with any associated mailbox as well?
          </p>
        </div>
      </div>
      <div slot="modal-footer">
        <button
          type="button"
          class="btn btn-primary"
          @click="onConfirmRemoveMailbox()"
        >
          Remove Mailbox + Group
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="onConfirmRemoveJustGroup()"
        >
          Remove Just Group
        </button>
        <button
          class="btn btn-secondary"
          @click="$refs.confirmRemoveMailbox.hide()"
        >
          Cancel
        </button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./group-managers.js"></script>
<style lang="scss" src="./group-managers.scss"></style>
