<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">group_work</i>
        </div>
        <h3>My AD Groups</h3>
      </div>
      <div class="card-body">
        

        <div class="container" v-if="!groups.length">
          <div class="system-message">
            <div class="alert alert-warning">
              <div class="info">
                <i class="far fa-stop-circle"></i>
              </div>
              <div class="message">
                <p class="pt-3 h4 text-secondary">It appears you have no groups to manage.</p>
                <p>We've tried to retrieve your groups but none were found</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Groups and Entities -->
        <div class="container" v-if="groups.length">
          <div class="form-group">
            <label for="my-groups" class="h4 text-secondary">My Groups</label>
            <select name="my-groups" id="my-groups" class="form-control" v-model="selectedGroup">
              <option v-for="item in groups" :key="item.displayName">{{item.displayName}}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="group-members" class="h4 text-secondary">Entities</label>
            
            <select
              name="group-members"
              id="group-members"
              class="form-control"
              v-model="selectedMember"
              size="4"
            >
              <option
                v-for="item in members"
                :key="item.distinguishedName"
              >{{item.distinguishedName}}</option>
            </select>

            <div class="text-right mt-2" v-if="!showEntitySearch">
              <button class="btn btn-primary mr-1" @click="showEntitySearchClick()">Add New Entity</button>
              <button
                class="btn btn-secondary"
                :class="{disabled: !selectedMember}"
                @click="confirmRemoveEntityClick()"
              >Remove</button>
            </div>
          </div>
        </div>
        <!-- End Groups and Entities -->
        <!-- Search Entity -->
        <transition name="fade">
          <div class="container" v-if="showEntitySearch">
            <span class="h4 text-secondary">Add Entity</span>
            <!-- Add Entity -->
            <div class="mt-3 pt-3 border-top border-secondary">
              <div class="row">
                <div class="col">
                  <div class="form-group form-inline px-3">
                    <label for>Entity Id</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="onyen, pid, or email"
                      v-model="memberSearch"
                      v-select-all
                      v-on:keyup.13="search()"
                    >
                    <button class="btn btn-primary" @click="search()">Find</button>
                    <button class="btn btn-secondary" @click="cancelAddMemberClick()">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- End Add Entity  -->
            <!-- Search Results -->
            <transition name="fade">
              <div class="search-results mt-4" v-if="foundEntity">
                <span class="h4 text-secondary">Entity Info</span>
                <div class="container mt-3 pt-3 border-top border-secondary">
                  <div class="row">
                    <div class="col">
                      <span class="label mr-1">Account</span>
                      <span>{{foundEntity.samAccountName}}</span>
                    </div>
                    <div class="col" v-if="foundEntity.employeeId">
                      <span class="label mr-1">PID</span>
                      <span>{{foundEntity.employeeId}}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <span class="label mr-1">CN</span>
                      <span>{{foundEntity.cn}}</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <span class="label mr-1">Distinguished Name</span>
                      <span>{{foundEntity.distinguishedName}}</span>
                    </div>
                  </div>
                  <div class="row mt-3" v-if="!foundEntity.employeeId">
                    <div class="col">
                      <div class="check-buttons">
                        <input
                          type="checkbox"
                          name="recursive"
                          id="chkRecursive"
                          v-model="recursive"
                        >
                        <label for="chkRecursive">Recursive</label>
                      </div>
                    </div>
                  </div>
                  <div class="text-right mt-2">
                    <button
                      class="btn btn-primary mr-1"
                      v-focus
                      @click="addEntityClick()"
                    >Add Entity</button>
                    <button
                      class="btn btn-secondary"
                      :class="{disabled: !selectedMember}"
                      @click="cancelAddMemberClick()"
                    >Cancel</button>
                  </div>
                </div>
              </div>
            </transition>
            <!-- End Search Results -->
          </div>
        </transition>
        <!-- End Search Entity -->
      </div>
    </div>
    <confirm-dialog id="confirmDeleteMember" ref="confirmDeleteMember">
      <div slot="modal-title"  class="text-white">Confirm: Delete Member?</div>
      <div slot="modal-body">
        <div class="info text-warning">
          <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        </div>
        <p>
          Confirm Delete Member
          <span class="strong underline">{{deleteMember.samAccountName}}</span> from group
        </p>
        <p class="strong">{{selectedGroup}}?</p>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="removeEntityClick()">yes</button>
        <button class="btn btn-secondary" @click="removeEntityCancelClick()">cancel</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./my-ad-groups.js"></script>
<style lang="scss" src="./my-ad-groups.scss" scoped></style>
