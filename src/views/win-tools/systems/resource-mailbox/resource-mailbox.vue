<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">contact_mail</i>
        </div>
        <h3>Resource Mailbox</h3>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-info-circle"></i>
          </div>
          <div class="mt-3">
            <p>Create Resource Mailbox, its full-access group and populate group with members.</p>
            <p>Resource mailboxes are similar to Shared Mailboxes but provide expanded calendar control.
               A typical use of Resource Mailbox is for managing room reservations.</p>
          </div>
        </div>
        <!-- Group Definition Fields/Lookup -->
        <div class="container">
          <div class="form-group">
            <label for="select-department">Departmental Unit Abbreviation (ie. ITS, DSA, FPG)</label>
            <select
              name="select-department"
              id="select-department"
              ref="select-department"
              class="form-control"
              v-model="model.department"
              data-validation="{'name': 'Department','message':'Department required'}"
            >
              <option value>-- select department --</option>
              <option
                v-for="(item, index) in organizationalUnits"
                :key="index"
                :value="item.name"
              >{{getDepartmentLabel(item)}}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="friendly-name">Friendly name for Global Address List</label>
            <input
              type="text"
              class="form-control"
              name="friendly-name"
              placeholder="Friendly Name"
              ref="friendlyName"
              data-validation="{'name': 'Friendly Name','message':'Friendly name is required', 'required':true}"
              v-model="model.displayName"
            >
          </div>
          <div class="form-group">
            <label for="mailbox-name">Shared Mailbox short name</label>
            <input
              type="text"
              class="form-control"
              name="mailbox-name"
              placeholder="Short Name"
              v-model="model.name"
              data-validation="{'name': 'Short Name','message':'Invalid, can contain only alpha numeric characters with no spaces', 'maxLength': 23,'regex': '^[-a-zA-Z0-9]+$'}"
              ref="name"
              title="Alpha Numeric only"
            >
          </div>
          
          <div class="submit text-right">
            <button
              class="btn btn-primary mr-1"
              @click="create"
              :disabled="showAddMembers"
              :class="{'disabled': showAddMembers}"
            >Create</button>
            <button
              class="btn btn-secondary"
              @click="clear"
              :disabled="showAddMembers"
              :class="{'disabled': showAddMembers}"
            >Clear</button>

            <a href="#" class="btn btn-primary ml-1" title="refresh" @click.prevent="create" v-if="showAddMembers">
              <i class="fa fa-refresh"></i>
            </a>
            
          </div>
        </div>
        <!-- Group Definition Fields/Lookup -->

        <div class="container" v-if="showAddMembers">
          <!-- Add Group Members -->
          <div class="section add-entity">
            <h3 class="text-primary">Members</h3>
            <div class="container">
              <div class="row bg-primary text-white row-header">
                <div class="col">User</div>
                <div class="col">Cononical Name</div>
                <div class="col"></div>
              </div>

              <div
                class="result-grid row"
                v-for="(item, index) in persistedModel.members"
                :key="index"
              >
                <div class="col">{{item.samAccountName}}</div>
                <div class="col">{{item.id}}</div>
                <div class="col">
                  <a href="#" @click.prevent="removeMember(item.samAccountName)">
                    <i class="fa fa-trash-o"></i>
                    <span>remove</span>
                  </a>
                </div>
              </div>
              <div class="container add-member">
                <div class="form-group form-inline">
                  <label for>Entity Id</label>
                  <input
                    type="text"
                    class="form-control input-xl"
                    placeholder="onyen, pid, email"
                    v-model="groupMemberId"
                    v-select-all
                    v-on:keyup.13="addGroupMember(groupMemberId)"
                  >
                  <button class="btn btn-primary" @click="addGroupMember()">Add</button>
                  <button class="btn btn-secondary" @click="groupMemberId = ''">Clear</button>
                </div>
              </div>
            </div>
          </div>
          <!-- Add Group Members -->

          <!-- Add Group Managers -->
          <div class="section add-entity mt-3">
            <h3 class="text-primary">Managers</h3>
            <div class="container">
              <div class="row bg-primary text-white row-header">
                <div class="col">User</div>
                <div class="col">Cononical Name</div>
                <div class="col"></div>
              </div>
              <div
                class="result-grid row"
                v-for="(item, index) in persistedModel.managers"
                :key="index"
              >
                <div class="col">{{item.samAccountName}}</div>
                <div class="col">{{item.id}}</div>
                <div class="col">
                  <a href="#" @click.prevent="removeManager(item.samAccountName)">
                    <i class="fa fa-trash-o"></i>
                    <span>remove</span>
                  </a>
                </div>
              </div>
              <div class="container add-member">
                <div class="form-group form-inline">
                  <label for>Entity Id</label>
                  <input
                    type="text"
                    class="form-control input-xl"
                    placeholder="onyen, pid, email"
                    v-model="groupManagerId"
                    v-select-all
                    v-on:keyup.13="addGroupManager(groupManagerId)"
                  >
                  <button class="btn btn-primary" @click="addGroupManager()">Add</button>
                  <button class="btn btn-secondary" @click="groupManagerId = ''">Clear</button>
                </div>
              </div>
            </div>
          </div>
          <!-- Add Group Managers -->
        </div>
        <!-- <h4 class="text-primary">Remedy 3701855, Allow a longer character limit</h4>
        <p>
          Allow a longer character limit (Currently 15 or 23 with the UNC prefix), the UNC prefix can take up to 7 characters, thus limiting the number of characters that can be used for the name. The current character limit is based on the longest possible prefix.
          Create shared mailboxes in the cloud. Currently mailboxes are created on-prem, and those have to be migrated to 365 after a DirSync cycle has occured. Creating them in 365 initially would save time.
        </p>-->
      </div>
    </div>
  </div>
</template>
<script src="./resource-mailbox.js"></script>
<style lang="scss" src="./resource-mailbox.scss" scoped></style>
