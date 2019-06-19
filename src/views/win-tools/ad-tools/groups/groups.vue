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
              v-model="criteria.groupName"
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
                      <div class="container group-members" v-if="item.detail.members && item.detail.members.length">
                        <h4>Members</h4>
                        <div class="bg-secondary text-white row-header border border-secondary">
                          <div class="col">Onyen</div>
                          <div class="col">Name</div>
                          <div class="col"></div>
                        </div>
                        <div class="records">
                          <div v-for="(member, key) in item.detail.members" :key="key">
                            <div class="col">{{member.samAccountName}}</div>
                            <div class="col">{{member.displayName}}</div>
                            <div class="col">
                              <a href="#" @click.prevent="removeMember(item, member)">
                                <i class="fa fa-trash-o"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="container group-members" v-else>
                        <div class="alert alert-info">
                          <div class="info">
                            <i class="fa fa-info-circle"></i>
                          </div>
                          <p class="pt-4 pb-2">
                            No members were found for group '
                            <strong>{{item.name}}</strong>' Use the controls below to add members to the group
                          </p>
                        </div>
                      </div>
                      <div class="container add-member">
                        <div class="form-group form-inline">
                          <label for>Entity Id</label>
                          <input
                            type="text"
                            class="form-control input-xl"
                            placeholder="onyen, pid, email,group name"
                            v-model="item.searchMember"
                            v-select-all
                             v-on:keyup.13="lookupMember(item)"
                          >
                          <button class="btn btn-primary" @click="lookupMember(item)">Lookup Entity</button>
                          <button class="btn btn-secondary" @click="clearAddMember(item)">Clear</button>
                        </div>

                        <div class="lookup-result" v-if="lookupEntityModel">
                          <h5 class="text-secondary">Lookup Result:</h5>
                          <div>
                            <ul>
                              <li>
                                <label for>Name</label>
                                <span>{{lookupEntityModel.name}}</span>
                              </li>
                              <li>
                                <label for>Type</label>
                                <span>{{lookupEntityModel.type}}</span>
                              </li>
                              <li>
                                <label for>Display Name</label>
                                <span>{{lookupEntityModel.displayName}}</span>
                              </li>
                              <li>
                                <label for>Email</label>
                                <span>{{lookupEntityModel.email}}</span>
                              </li>
                              <li v-if="lookupEntityModel.distinguishedName">
                                <label for>Distinguished Name</label>
                                <span>{{lookupEntityModel.distinguishedName}}</span>
                              </li>
                              <li v-if="lookupEntityModel.type === 'group'">
                                <label for>Total Members</label>
                                <span>{{lookupEntityModel.totalMembers}}</span>
                              </li>
                            </ul>

                            <div class="form-controls">
                              <div class="check-buttons text-right" v-if="lookupEntityModel.type === 'group'">
                                <input
                                  type="checkbox"
                                  name="recursive"
                                  id="chkRecursive"
                                  v-model="item.recursive"
                                >
                                <label for="chkRecursive">Include All Entities/Recursive?</label>
                              </div>
                              <div class="submit">
                                <button class="btn btn-primary mr-1">Add Entity</button>
                                <button class="btn btn-secondary" @click="clearAddMember(item)">Cancel</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
<style lang="scss" src="./groups.scss" scoped></style>
