<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-tools" aria-hidden="true"></i>
        </div>
        <h1>Edit List - {{listName}}</h1>
      </div>
      <div class="card-body">
        <!-- List Metrics -->

        <tabbed-control tabs="List Info,List Metrics">
          <tabbed-item slot="tab_0">
            <div class="table-info">
              <span class="label">
                Site Name:
                <span>{{data.siteName}}</span>
              </span>
              <span class="label">
                Create Date:
                <span>{{data.createDate | formatDate}}</span>
              </span>
              <span class="label">
                Description:
                <span>{{data.description}}</span>
              </span>
              <span class="label">
                Visibility:
                <span>{{data.visibility}}</span>
              </span>
              <span class="label">
                Max Members:
                <span v-if="data.maxMembers === 0">
                  Unlimited
                  <a
                    href="#"
                    v-on:click.prevent="toggleSubsciberCap()"
                    title="Set Subscirber Cap"
                  >
                    <i class="fa fa-minus-circle" aria-hidden="true"></i>
                    <span>Set Subscriber Cap</span>
                  </a>
                </span>
                <span v-else>
                  {{data.maxMembers}}
                  <a
                    href="#"
                    v-on:click.prevent="toggleSubsciberCap()"
                    title="Remove Subscirber Cap"
                  >
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    <span>Remove Subscriber Cap</span>
                  </a>
                </span>
              </span>
              <span class="label">
                Max Msg Number:
                <span>{{data.maxMessageNumber}}</span>
              </span>
              <span class="label">
                Max Msg Size:
                <span>{{data.maxMessageSize}}</span>
              </span>
              <span class="label">
                Disabled:
                <span v-if="data.disabled">
                  Disabled
                  <a href="#" v-on:click.prevent="toggleListEnable()" title="Enable List">
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    <span>Enable List</span>
                  </a>
                </span>
                <span v-else>
                  Enabled
                  <a href="#" v-on:click.prevent="toggleListEnable()" title="Disable List">
                    <i class="fa fa-minus-circle" aria-hidden="true"></i>
                    <span>Disable List</span>
                  </a>
                </span>
              </span>
            </div>
          </tabbed-item>
          <tabbed-item slot="tab_1">
            <div class="list-metrics">
              <div class="text-primary" v-if="retrievingMetrics">retrieving list metrics...</div>
              <div v-if="!retrievingMetrics && metrics">
                <h5 class="text-primary">
                  List Metrics for: {{metrics.listName}}
                </h5>
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
                  <i class="fa fa fa-refresh" aria-hidden="true"></i> failed retrieving metrics retry?
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
                <i class="fa fa-trash" aria-hidden="true"></i>
                <span>Delete List</span>
              </button>
              <button class="btn btn-primary" @click="clickAddNewMember()">
                <i class="fa fa-plus" aria-hidden="true"></i>
                <span>Add Member</span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="members.length" class="container member-list">
          <!-- Pager -->
          <pager
            :criteria="criteria"
            btn-count="5"
            :total-records="totalRecords"
            v-on:indexChanged="indexChanged"
            v-if="totalRecords > 100"
          ></pager>
          <!-- Pager -->

          <!-- Header Cols /Sort -->
          <div class="row bg-primary text-white row-header">
            <div class="col">
              <label for="filter-fullname" class="p-0 m-0">
                <a href="#" @click.prevent="sort('fullName')">Full Name</a>
              </label>
            </div>
            <div class="col">
              <label for="filter-email" class="p-0 m-0">
              <a href="#" @click.prevent="sort('email')">E-mail</a>
              </label>
            </div>
            <div class="col">
              <label for="filter-admin" class="p-0 m-0">
              <a href="#" @click.prevent="sort('admin')">Is Admin</a>
              </label>
            </div>
            <div class="">
              <label for="filter-hold-status" class="hidden">Hold Status</label>
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
                id="filter-fullname"
              />
            </div>
            <div class="col">
              <input
                autocomplete="off"
                type="text"
                class="form-control"
                v-select-all
                v-model="filter.email"
                placeholder="filter e-mail"
                id="filter-email"
              />
            </div>
            <div class="col filter-edit-col">
              <select id="filter-admin" class="form-control" v-model="filter.isAdmin" >
                <option value>All</option>
                <option value="isadmin">Is Admn</option>
              </select>
              <select id="filter-hold-status" class="form-control" v-model="filter.holdStatus">
                <option value>All</option>
                <option value="held">Hold</option>
                <option value="normal">Unhold</option>
              </select>
            </div>
          </div>
          <!-- Column Filters -->

          <!-- Record Results -->
          <transition-group name="list">
            <div
              class="result-grid row"
              v-for="item in filteredMembers"
              v-bind:key="item.emailAddress"
            >
              <div class="col">{{item.fullName}}</div>
              <div class="col">{{item.emailAddress}}</div>
              <div class="col edit-col">
                <div class="icon-mark">
                  <i class="fa fa-check" v-if="item.isListAdmin" aria-hidden="true"></i>
                  <span>List Admin</span>
                </div>
                <div class="edit-links">
                  <a
                    href="#"
                    @click.prevent="toggleHold(item)"
                    class="hold-status"
                    title="toggle hold status"
                  >
                    <div v-if="item.memberType == 'held'">
                      <i class="fa fa-lock" aria-hidden="true"></i>
                      <span>Lock</span>
                    </div>
                    <div v-else>
                      <i class="fa fa-lock-open" aria-hidden="true"></i>
                      <span>Unlock</span>
                    </div>
                  </a>
                  <a href="#" @click.prevent="clickUpdateMember(item)" title="edit">
                    <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    <span>Edit List</span>
                  </a>
                  <a href="#" @click.prevent="removeMember(item)" title="remove">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                    <span>Remove List</span>
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
      <div slot="modal-title" class="text-white">Add Member</div>
      <div slot="modal-body">
        <div class="containter form-group">
          <label for="member-email">Member E-Mail</label>
          <input
            type="text"
            id="member-email"
            class="form-control"
            placeholder="Member E-Mail"
            v-model="modelAddMember.emailAddress"
            v-select-all
          />
          <label for="member-full-name">Member Full Name</label>
          <input
            type="text"
            class="form-control"
            placeholder="Full Name"
            id="member-full-name"
            v-model="modelAddMember.fullName"
            v-select-all
          />
          <div class="check-buttons">
            <input
              type="checkbox"
              name="chkIsListAdmin"
              id="chkIsListAdmin"
              v-model="modelAddMember.isListAdmin"
              :value="modelAddMember.isListAdmin"
            />
            <label for="chkIsListAdmin" class="m-0">Is Admin?</label>
          </div>

          <input
            type="password"
            class="form-control"
            placeholder="Password"
            v-select-all
            v-model="modelAddMember.password"
            v-if="modelAddMember.isListAdmin"
          />
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
      <div slot="modal-title" class="text-white">Update Member: {{modelUpdateMember.fullName}}</div>
      <div slot="modal-body">
        <div class="containter form-group">
          <label for="update-member-email">Member E-Mail</label>
          <input
            type="text"
            id="update-member-email"
            class="form-control"
            placeholder="Member E-Mail"
            v-model="modelUpdateMember.emailAddress"
            v-select-all
          />
          <label for="update-full-name">Member Full Name</label>
          <input
            type="text"
            class="form-control"
            placeholder="Full Name"
            id="update-full-name"
            v-model="modelUpdateMember.fullName"
            v-select-all
          />
          <div class="check-buttons">
            <input
              type="checkbox"
              name="chkUpdateIsListAdmin"
              id="chkUpdateIsListAdmin"
              v-model="modelUpdateMember.isListAdmin"
              :value="modelUpdateMember.isListAdmin"
            />
            <label for="chkUpdateIsListAdmin" class="m-0">Is Admin?</label>
          </div>

          <input
            type="password"
            class="form-control"
            placeholder="Password"
            v-select-all
            v-model="modelUpdateMember.password"
            v-if="modelUpdateMember.isListAdmin"
          />
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
      <div slot="modal-title" class="text-white">Update List: {{modelUpdateList.title}}</div>
      <div slot="modal-body">
        <div class="containter form-group" v-html="modelUpdateList.html"></div>
      </div>

      <div slot="modal-footer">
        <button class="btn btn-primary" @click="modelUpdateList.confirm()">yes</button>
        <button class="btn btn-secondary" @click="closeDialog()">cancel</button>
      </div>
    </confirm-dialog>
    <!-- Update List Change confirm-dialog -->
  </div>
</template>
<script src="./edit-list.js"></script>
<style lang="scss" src="./edit-list.scss" scoped></style>
