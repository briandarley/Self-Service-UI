<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-tools"></i>
        </div>
        <h3>Edit List - {{listName}}</h3>
      </div>
      <div class="card-body">
        <!-- List Metrics -->

        
          <tabbed-control tabs="List Info,List Metrics">
            <tabbed-item slot="tab_0">
              <div class="table-info">
                <label>
                  Site Name:
                  <span>{{data.siteName}}</span>
                </label>
                <label>
                  Create Date:
                  <span>{{data.createDate | formatDate}}</span>
                </label>
                <label>
                  Description:
                  <span>{{data.description}}</span>
                </label>
                <label>
                  Visibility:
                  <span>{{data.visibility}}</span>
                </label>
                <label>
                  Max Members:
                  <span v-if="data.maxMembers === 0">Unlimited
                    <a href="#" v-on:click.prevent="toggleSubsciberCap()" title="Set Subscirber Cap">
                      <i class="fa fa-minus-circle"></i>
                    </a>

                  </span>
                  <span v-else>
                    {{data.maxMembers}}
                    <a href="#"  v-on:click.prevent="toggleSubsciberCap()" title="Remove Subscirber Cap">
                      <i class="fa fa-plus-circle"></i>
                    </a>
                  </span>
                </label>
                <label>
                  Max Msg Number:
                  <span>{{data.maxMessageNumber}}</span>
                </label>
                <label>
                  Max Msg Size:
                  <span>{{data.maxMessageSize}}</span>
                </label>
                <label>
                  Disabled:
                  <span>{{data.disabled}}</span>
                </label>
              </div>
            </tabbed-item>
            <tabbed-item slot="tab_1">
              <div class="list-metrics">
                <div class="text-primary" v-if="retrievingMetrics">retrieving list metrics...</div>
                <div v-if="!retrievingMetrics && metrics">
                  <h3>
                    <span class="h5 text-primary">List Metrics for: {{metrics.listName}}</span>
                  </h3>
                  <div class="list-metrics-data">
                    <div>
                      <label>Create Date</label>
                      <span>{{metrics.createDate | formatDate}}</span>
                    </div>
                    <div>
                      <label class="strong">Total Members</label>
                      <span>{{metrics.totalMembers | formatNumber}}</span>
                    </div>
                    <div>
                      <label class="strong">Total Messages</label>
                      <span>{{metrics.totalMessages | formatNumber}}</span>
                    </div>
                    <div>
                      <label class="strong">Last Log Activity</label>
                      <span
                        v-if="metrics.lastLogActivityDate"
                      >{{metrics.lastLogActivityDate | formatDate}}</span>
                      <span v-else>No Log Activity</span>
                    </div>
                    <div>
                      <label class="strong">Last Message Date</label>
                      <span v-if="metrics.lastMessageDate">{{metrics.lastMessageDate | formatDate}}</span>
                      <span v-else>No Message Activity</span>
                    </div>
                  </div>
                </div>
                <div v-if="refreshMetrics">
                  <a href="#" v-on:click.prevent="getMetrics()">
                    <i class="fa fa fa-refresh"></i> failed retrieving metrics retry?
                  </a>
                </div>
              </div>
            </tabbed-item>
          </tabbed-control>
        

        <!-- List Metrics -->

        <div class="container member-list">
          <div class="row cmds-result">
            <h3 class="text-primary">List Members {{members.length | formatNumber}}</h3>
            <div>
              <button class="btn btn-danger" @click="deleteList()">
                <i class="fa fa-trash"></i>
                <span>Delete List</span>
              </button>
              <button class="btn btn-primary" @click="toggleListEnable()">
              
                <span v-if="data.disabled"><i class="fas fa-toggle-off"></i> Enable List</span>
                <span v-else><i class="fas fa-toggle-on"></i> Disable List</span>
              </button>
              <button class="btn btn-primary" @click="clickAddNewMember()">
                <i class="fa fa-plus"></i>
                <span>Add Member</span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="members.length" class="container member-list">
          <!-- Header Cols /Sort -->
          <div class="row bg-primary text-white row-header">
            <div class="col">
              <a href="#" @click.prevent="sort('fullName')">Full Name</a>
            </div>
            <div class="col">
              <a href="#" @click.prevent="sort('email')">E-mail</a>
            </div>
            <div class="col">
              <a href="#" @click.prevent="sort('admin')">Is Admin</a>
            </div>
          </div>
          <!-- Header Cols /Sort -->

          <!-- Column Filters -->
          <div class="row row-filter">
            <div class="col">
              <input
                autocomplete="off"
                type="text"
                class="form-control"
                v-select-all
                v-model="filter.fullName"
                placeholder="filter full name"
              >
            </div>
            <div class="col">
              <input
                autocomplete="off"
                type="text"
                class="form-control"
                v-select-all
                v-model="filter.email"
                placeholder="filter e-mail"
              >
            </div>
            <div class="col filter-edit-col">
              <select name id class="form-control" v-model="filter.isAdmin">
                <option value>All</option>
                <option value="isadmin">Is Admn</option>
              </select>
              <select name id class="form-control" v-model="filter.holdStatus">
                <option value>All</option>
                <option value="held">Hold</option>
                <option value="normal">Unhold</option>
              </select>
            </div>
          </div>
          <!-- Column Filters -->
          
          <!-- Record Results -->
          <transition-group name="list">
            <div class="result-grid row" v-for="item in filteredMembers" v-bind:key="item.emailAddress">
              <div class="col">{{item.fullName}}</div>
              <div class="col">{{item.emailAddress}}</div>
              <div class="col edit-col">
                <div>
                  <i class="fa fa-check" v-if="item.isListAdmin"></i>
                </div>
                <div class="edit-links">
                  <a
                    href="#"
                    @click.prevent="toggleHold(item)"
                    class="hold-status"
                    title="toggle hold status"
                  >
                    <span v-if="item.memberType == 'held'">
                      <i class="fa fa-lock"></i>
                    </span>
                    <span v-else>
                      <i class="fa fa-lock-open"></i>
                    </span>
                  </a>
                  <a href="#" @click.prevent="clickUpdateMember(item)" title="edit">
                    <i class="fa fa-pencil-square-o"></i>
                  </a>
                  <a href="#" @click.prevent="removeMember(item)" title="remove">
                    <i class="fa fa-trash-o"></i>
                  </a>
                </div>
              </div>
            </div>
          </transition-group>
          <!-- Record Results -->
        </div>
      </div>
    </div>
    <!-- Add Member confirm-dialog -->
    <confirm-dialog id="modalAddMember" ref="modalAddMember">
      <div slot="modal-title"  class="text-white">
        <span class="text-primary">Add Member</span>
      </div>
      <div slot="modal-body">
        <div class="containter form-group">
          <input
            type="text"
            class="form-control"
            placeholder="Member E-Mail"
            v-model="modelAddMember.emailAddress"
            v-select-all
          >
          <input
            type="text"
            class="form-control"
            placeholder="Full Name"
            v-model="modelAddMember.fullName"
            v-select-all
          >
          <div class="check-buttons">
            <input
              type="checkbox"
              name="isListAdmin"
              id="chkIsListAdmin"
              v-model="modelAddMember.isListAdmin"
              :value="modelAddMember.isListAdmin"
            >
            <label for="chkIsListAdmin">Is Admin?</label>
          </div>

          <input
            type="password"
            class="form-control"
            placeholder="Password"
            v-select-all
            v-model="modelAddMember.password"
            v-if="modelAddMember.isListAdmin"
          >
        </div>
      </div>

      <div slot="modal-footer">
        <button
          class="btn btn-primary"
          @click="saveNewMember()"
          :disabled="!modelAddMember.valid"
        >add member</button>
        <button class="btn btn-secondary" @click="closeDialog()">cancel</button>
      </div>
    </confirm-dialog>
    <!-- Add Member confirm-dialog -->
    <!-- Update Member confirm-dialog -->
    <confirm-dialog id="modalUpdateMember" ref="modalUpdateMember">
      <div slot="modal-title"  class="text-white">
        <span class="text-primary">Update Member {{modelUpdateMember.fullName}}</span>
      </div>
      <div slot="modal-body">
        <div class="containter form-group">
          <input
            type="text"
            class="form-control"
            placeholder="Member E-Mail"
            v-model="modelUpdateMember.emailAddress"
            v-select-all
          >
          <input
            type="text"
            class="form-control"
            placeholder="Full Name"
            v-model="modelUpdateMember.fullName"
            v-select-all
          >
          <div class="check-buttons">
            <input
              type="checkbox"
              name="isListAdmin"
              id="chkIsListAdmin"
              v-model="modelUpdateMember.isListAdmin"
              :value="modelUpdateMember.isListAdmin"
            >
            <label for="chkIsListAdmin">Is Admin?</label>
          </div>

          <input
            type="password"
            class="form-control"
            placeholder="Password"
            v-select-all
            v-model="modelUpdateMember.password"
            v-if="modelUpdateMember.isListAdmin"
          >
        </div>
      </div>

      <div slot="modal-footer">
        <button
          class="btn btn-primary"
          @click="updateMember()"
          :disabled="!modelUpdateMember.valid"
        >update member</button>
        <button class="btn btn-secondary" @click="closeDialog()">cancel</button>
      </div>
    </confirm-dialog>
    <!-- Update Member confirm-dialog -->
    <!-- Update List Change confirm-dialog -->
    <confirm-dialog id="modalUpdateList" ref="modalUpdateList">
      <div slot="modal-title"  class="text-white">
        <span class="text-primary">{{modelUpdateList.title}}</span>
      </div>
      <div slot="modal-body">
        <div class="containter form-group" v-html="modelUpdateList.html">
        </div>
      </div>

      <div slot="modal-footer">
        <button
          class="btn btn-primary"
          @click="modelUpdateList.confirm()"
        >yes</button>
        <button class="btn btn-secondary" @click="closeDialog()">cancel</button>
      </div>
    </confirm-dialog>
    <!-- Update List Change confirm-dialog -->
  </div>
</template>
<script src="./edit-list.js"></script>
<style lang="scss" src="./edit-list.scss" scoped></style>
