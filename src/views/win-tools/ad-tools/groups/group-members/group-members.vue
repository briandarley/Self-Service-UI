<template>
  <div class="container group-members">
    <div class="card card-icon" :class="{ hidden: !isLoaded }">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-object-group"></i>
        </div>
        <h1>Group Members</h1>
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
          <div v-if="groupDetail.memberOf.length">
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
              Use this tool to view, add, and remove members of the current
              group.
            </p>

            <p>
              Some functions such as adding, removing members are restricted. If
              the group is managed by SelfService or by your logged in account,
              the option to manage this group will be made available. If the
              option is not available contact the IDM team to either have
              SelfService manage the group or add your account to the list of
              managers for the indicated group.
            </p>
          </div>
          <div class="align-self-start">
            <a href="#" @click.prevent="hideInfo = true"
              ><i class="fa fa-times"></i
            ></a>
          </div>
        </div>
        <div class="d-flex justify-content-between my-3">
          <div>
            <button
              type="button"
              class="btn btn-primary ml-1 btn-sm"
              @click="goToGroupSearch()"
            >
              <i class="fa fa-angle-left"></i>
              Back to Group Search
            </button>

            <button
              type="button"
              class="btn btn-primary ml-1 btn-sm"
              @click="goToGroupManagers()"
              :disabled="!editManagersEnabled"
            >
              <i class="fa fa-angle-right mx-1"></i>
              Edit Group Managers
            </button>
          </div>
          <div>
            <button
              class="btn btn-primary btn-sm"
              :disabled="!isSafeGroupForMembers"
              @click="onShowAddMember()"
            >
              <i class="fa fa-plus-circle"></i>
              Add Member
            </button>
          </div>
        </div>
        <div v-if="pagedResponse.totalRecords">
          <div class="border border-primary search-criteria">
            <div class="bg bg-primary text-white p-2">Search Criteria</div>
            <div class="m-2">
              <div class="row-1">
                <div class="row-1"></div>
              </div>
              <div class="row-1">
                <div class="form-group" data-lpignore="true">
                  <label for="memberId-search">Member Id</label>
                  <input
                    type="text"
                    id="memberId-search"
                    name="memberId-search"
                    class="form-control"
                    v-select-all
                    placeholder="onyen, pid, email, sam account name"
                    v-model="criteria.filterText"
                    v-on:keyup.13="search()"
                    autocomplete="off"
                  />
                </div>
              </div>

              <div class="submit text-right">
                <button class="btn btn-primary " @click="search()">
                  Search
                </button>
                <button class="btn btn-secondary" @click="clear()">
                  Clear
                </button>
              </div>
            </div>
          </div>

          <div class="ml-3 pt-2 custom-control custom-checkbox ">
            <input
              type="checkbox"
              id="chkRecursive"
              class="custom-control-input"
              v-model="criteria.recursiveSearch"
              @change="search()"
            />
            <label
              for="chkRecursive"
              class="font-weight-bolder text-primary custom-control-label"
              >Recursive Lookup? (List members within groups, slower)</label
            >
          </div>

          <div class="mt-3">
            <!-- <div class="bg bg-primary text-white p-2">Search Results</div> -->

            <div class="d-flex mt-5" style="justify-content:space-between">
              <h3 class="text-secondary">
                Total Members {{ pagedResponse.totalRecords | formatNumber }}
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
              <div class="bg-secondary text-secondary row-header">
                <div>
                  <a href="#" @click.prevent="sort('cn')">CN</a>
                </div>

                <div><a href="#" @click.prevent="sort('mail')">Email</a></div>

                <div>
                  <a href="#" @click.prevent="sort('objectClass')">Type</a>
                </div>

                <div class="control">Action</div>
              </div>
              <div class="results">
                <div
                  class="result-grid"
                  v-for="(item, index) in pagedResponse.entities"
                  :key="index"
                >
                  <div class="record-info">
                    <div class="record-info-detail">
                      <div>{{ item.cn | filterCn }}</div>

                      <div>{{ item.mail }}</div>
                      <div>{{ item.objectClass }}</div>

                      <div>
                        <a
                          href="#"
                          @click.prevent="editGroup(item)"
                          v-if="item.objectClass === 'group'"
                          class="text-dark mr-1"
                          >Edit</a
                        >

                        <a
                          href="#"
                          @click.prevent="removeMember(item)"
                          v-if="isSafeGroupForMembers"
                          class="text-dark"
                          >Remove</a
                        >
                        <span v-else class="text-dark">Remove</span>
                      </div>
                    </div>
                  </div>
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
        <div v-else>
          <div class="alert alert-warning mt-4">
            <div class="info">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div>
              <p class="my-1">
                No members found in group.
              </p>
              <p v-if="canAddMember">
                Click 'Add Member' button to add members to group.
              </p>
              <p v-else>
                This group is restricted and cannot be modified.
              </p>
            </div>
          </div>
        </div>

        <!-- showAddMember -->

        <div v-if="showAddMember">
          <div v-if="!showUpload">
            <div class="mt-3 border border-secondary mx-2">
              <h6 class="p-2 bg-secondary text-white">New Member Lookup</h6>
              <div class="add-meber d-flex">
                <div class="form-group  d-flex w-60">
                  <label for="memberId-search" class="w-25 text-right pr-2 pt-1"
                    >Entity Id</label
                  >
                  <input
                    type="text"
                    id="memberId-search"
                    name="memberId-search"
                    class="form-control "
                    v-select-all
                    placeholder="entity Id, (Onyen, PID, SamAccountName,CN)"
                    v-model="modelSearch.filterText"
                    v-on:keyup.13="lookupEntity()"
                    autocomplete="off"
                  />
                </div>
                <div class="mr-1">
                  <button
                    type="button"
                    class="btn btn-primary"
                    @click="lookupEntity()"
                  >
                    <i class="fa fa-search small"></i>
                    Lookup
                  </button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="clearLookup()"
                  >
                    <i class="fa fa-trash small"></i>
                    Clear
                  </button>
                  <button
                    class="btn btn-secondary"
                    @click="showUploadControl()"
                  >
                    <i class="fa fa-upload"></i>
                    Upload File
                  </button>
                </div>
              </div>

              <div v-if="adEntity.cn">
                <div class="search-result m-3">
                  <div class="bg-secondary text-white row-header">
                    <div>
                      CN
                    </div>
                    <div>
                      Display Name
                    </div>
                    <div>
                      Mail
                    </div>

                    <div>
                      Type
                    </div>
                  </div>
                  <div class="record-info">
                    <div class="record-info-detail">
                      <div>{{ adEntity.cn | filterCn }}</div>
                      <div>{{ adEntity.displayName }}</div>

                      <div>{{ adEntity.mail }}</div>
                      <div class="text-center">{{ adEntity.objectClass }}</div>

                      <!-- {{adEntity}} -->
                    </div>
                  </div>
                </div>

                <div class="text-right m-3">
                  <button
                    class="btn btn-primary mr-2"
                    @click="addToMemberList()"
                  >
                    Add Entity
                  </button>
                  <button class="btn btn-secondary" @click="resetSearch()">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="border border-primary">
            <file-upload
              :options="fileUploadOptions"
              @fileUploaded="onFileUploaded"
              @fileUploadedError="onFileUploadedError"
              @fileUploadBegin="onFileUploadBegin"
              @fileUploadComplete="onFileUploadComplete"
              @canceled="resetSearch"
            >
              <div slot="header">
                <div
                  class="bg-secondary p-2 text-white d-flex justify-content-between"
                >
                  <span>Upload File</span>
                  <span>
                    <a
                      class="text-white"
                      title="download csv"
                      href="#"
                      @click.prevent="downloadTemplate(item)"
                      aria-label="Download CSV file"
                    >
                      <span class="text-white mr-1">Template</span>
                      <i class="fas fa-file-csv" aria-hidden="true"></i>
                    </a>
                  </span>
                </div>
                <div class="upload-instructions">
                  <i class="fa fa-info-circle"></i>
                  <p>
                    Use the control below to upload a list of members for selected group. Use the template if
                    needed to assist with formatting. 
                  </p>
                </div>
              </div>

              <!-- File-Upload Footer -->
              <div slot="footer">
                <div class="container my-3" v-if="addMemberResponse.length">
                  <h4>
                    Total Added Records
                    {{ addMemberResponse.filter((c) => c.adUser.cn).length }}
                  </h4>
                  <div class="search-result add-member-result ">
                    <div class="bg-secondary text-white row-header">
                      <div>
                        CN
                      </div>
                      <div>
                        Type
                      </div>
                      <div>
                        Status
                      </div>
                      <div class="control"></div>
                    </div>

                    <div class="results">
                      <div
                        class="result-grid"
                        v-for="(item, index) in addMemberResponse"
                        :key="index"
                      >
                        <div class="record-info">
                          <div class="record-info-detail" v-if="item.adUser.cn">
                            <div>{{ item.adUser.cn }}</div>
                            <div class="text-center">
                              {{ item.adUser.objectClass }}
                            </div>
                            <div>{{ item.status }}</div>
                            <div></div>
                          </div>
                          <div class="record-info-detail" v-else>
                            <div>{{ item.adUser }}</div>
                            <div></div>
                            <div></div>
                            <div>{{ item.status }}</div>
                            <div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- File-Upload Footer -->
            </file-upload>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./group-members.js"></script>
<style lang="scss" src="./group-members.scss" scoped></style>
