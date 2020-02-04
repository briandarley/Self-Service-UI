<template>
  <div class="container" autocomplete="off">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fas fa-mail-bulk" aria-hidden="true"></i>
        </div>
        <h1>Shared Mailbox</h1>
      </div>
      <div class="card-body">
        <div class="border border-primary">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div class="mt-1">
              <p>Create a Shared Mailbox, its full-access group and populate group with members.</p>
              <p>Shared mailboxes are usually for correspondence and have calendars built in, just like personal mailboxes.</p>
              <p>If the shared mailbox with the provided name already exists in the system you will have the option to manage it from this view.</p>
              <p><strong>NOTE:</strong> Creation of Shared Mailbox can take a while to process. Please wait for confirmation before proceeding.</p>
            </div>
          </div>
          <!-- Group Definition Fields/Lookup -->
          <form
            @submit.prevent.prevent
            class="container"
            role="form"
            ref="submitForm"
            autocomplete="off"
          >
            <div class="form-group">
              <label for="select-department">Departmental Unit Abbreviation (i.e. ITS, DSA, FPG)</label>
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
                id="friendly-name"
                ref="friendlyName"
                data-validation="{'name': 'Friendly Name','message':'Friendly name is required', 'required':true}"
                v-model="model.displayName"
              />
            </div>
            <div class="form-group">
              <label for="mailbox-name">Shared Mailbox short name</label>
              <input
                type="text"
                class="form-control"
                name="mailbox-name"
                id="mailbox-name"
                placeholder="Short Name"
                v-model="model.name"
                data-validation="{'name': 'Short Name','message':'Invalid, can contain only alpha numeric characters with no spaces', 'maxLength': 23,'regex': '^[-a-zA-Z0-9]+$'}"
                ref="name"
                title="Alpha Numeric only"
              />
            </div>
            <div class="form-group">
              <label for="reply-to">Reply-to Address (This should be a unique email address)</label>
              <input
                type="text"
                class="form-control"
                name="reply-to"
                id="reply-to"
                placeholder="Reply to Address"
                v-model="model.replyToAddress"
                ref="replyToAddress"
                data-validation="{'name': 'Reply to Address','type':'email', 'minLength': 10}"
              />
            </div>
            <div class="submit text-right mb-3">
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

              <a
                href="#"
                class="btn btn-primary ml-1"
                title="refresh"
                @click.prevent="create"
                v-if="showAddMembers"
                aria-label="Refresh Members and Managers lists"
              >
                <i class="fa fa-refresh" aria-hidden="true"></i>
              </a>
            </div>
          </form>

          <!-- Group Definition Fields/Lookup -->
         
            <div class="container" v-if="showAddMembers">
               <section class="border border-primary p-2">
            
              <!-- Add Group Members -->
              <div class="section add-entity">
                <h3 class="text-primary">Members</h3>

                <user-list-management
                  ref="groupMembers"
                  :group="groupId"
                  @controlLoaded="onMemberListLoaded"
                  @groupRetrieveFailed="onGroupRetrieveFailed"
                  :service="ExchangeToolsService"
                ></user-list-management>
              </div>
              <!-- Add Group Members -->

              <!-- Add Group Managers -->
              <div class="section add-entity mt-3">
                <h3 class="text-primary">Managers</h3>

                <manager-list-management
                  ref="groupManagers"
                  :group="groupId"
                  @controlLoaded="onManagerListLoaded"
                  @groupRetrieveFailed="onGroupManagerRetrieveFailed"
                  :service="ExchangeToolsService"
                ></manager-list-management>
              </div>
              <!-- Add Group Managers -->
              </section>
            </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./shared-mailbox.js"></script>
<style lang="scss" src="./shared-mailbox.scss" scoped></style>
