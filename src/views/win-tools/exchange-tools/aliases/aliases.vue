<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fa-user-circle-o"></i>
        </div>
        <h3>Aliases</h3>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label for>User Id</label>
          <input
            type="text"
            class="form-control"
            v-select-all
            v-model="filter"
            placeholder="onyen"
            v-on:keyup.13="search()"
          >
        </div>
        <div class="submit text-right">
          <button class="btn btn-primary mr-1" @click="search()">Search</button>
          <button class="btn btn-secondary" @click="clear()">Clear</button>
        </div>

        <div class="container" v-if="adUser">
          <div class="alert alert-info mt-3">
            <p>
                Use the radio buttons on the grid to designate the a primary alias.
                Some aliases may not be selected or removed as they are required for proper account function.</p>
            <p>Use the 'Add Email Alias' button to add new aliases for the selected account</p>
            <p>Use the 'Forward Address' button to set or remove Forwarding Smtp Address for the selected account</p>
          </div>
          <div class="submit text-right">
            <button class="btn btn-primary mr-2" @click="showAddEmailAliasDialog()">
              <i class="fa fa-plus-circle"></i>
              <span class="ml-2">Add Email Alias</span>
            </button>
            <button class="btn btn-primary" @click="showAddFormwardingAddressDialog()">
              <i class="fa fa-address-card"></i>
              <span class="ml-2">Forward Address</span>
            </button>
          </div>
          <!-- Alias List -->
          <div class="row bg-primary text-white row-header">
            <div class="col-1">Alias</div>
            <div class="col-2 text-center">Is Primary</div>
            <div class="col-3"></div>
          </div>
          <div class="result-grid row" v-for="item in emailAddresses" v-bind:key="item.email">
            <div class="col-1">{{item.email}}</div>
            <div class="col-2 radio-buttons text-center">
              <input
                type="radio"
                name="primary"
                :checked="item.primary"
                :value="item.email"
                v-model="primary"
                :disabled="!item.valid"
                @change="confirmChangePrimaryAlias($event)"
              >
            </div>

            <div class="col-3 text-right">
              <a
                href="#"
                @click.prevent="confrimDeleteEntity(item)"
                title="delete alias"
                :disabled="!item.valid"
                :class="{'text-disabled': !item.valid}"
              >
                <i class="fa fa-trash-o"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <confirm-dialog id="confirmChangePrimaryAliasDialog" ref="confirmChangePrimaryAliasDialog">
      <div slot="modal-title" class="text-white">Confirm: Change Primary Alias?</div>
      <div slot="modal-body">
        <div class="info text-warning">
          <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        </div>
        <p>
          Confirm Set Primary Alias
          <span class="strong">{{selectedPrimarySmtp}}</span>?
        </p>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="confirmChangePrimaryAliasClick()">yes</button>
        <button class="btn btn-secondary" @click="confirmChangePrimaryAliasCancelClick()">cancel</button>
      </div>
    </confirm-dialog>
    <confirm-dialog id="confirmDelete" ref="confirmDelete">
      <div slot="modal-title" class="text-white">Confirm: Delete Alias?</div>
      <div slot="modal-body">
        <div class="info text-warning">
          <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
        </div>
        <p>
          Confirm Delete Alias
          <span class="strong">{{deleteEntity.email}}</span>?
        </p>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="removeEntityClick()">yes</button>
        <button class="btn btn-secondary" @click="removeEntityCancelClick()">cancel</button>
      </div>
    </confirm-dialog>
    <confirm-dialog id="addEmailAliasDialog" ref="addEmailAliasDialog" width="800">
      <div slot="modal-title" class="text-white">Add Email Alias</div>
      <div slot="modal-body">
        <div class="container">
          <div class="alert alert-info">
            <p>Use the controls below to append an alias to the selected account.</p>
            <p>
              The drop down list shown has been pre-populated by the Identity Management Team and is specific to your account profile.
              If you wish to add more aliases please send a request to the Identity Management Team.
            </p>
          </div>

          <div class="form-group add-alias-cmd">
            <div class="form-inline">
              <input
                type="text"
                class="form-control"
                placeholder="alias prefix"
                v-model="newAliasPrefix"
                v-select-all
              >
              <i class="fa fa-at"></i>
              <select name id class="form-control" v-model="newAliasDomain">
                <option v-for="item in adminProfile.adminAliases" :key="item.id">{{item.domain}}</option>
              </select>
              <button class="btn btn-primary" @click="addEmailAlias()">Add</button>
              <button class="btn btn-secondary" @click="newAliasPrefix = ''">Clear</button>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closeAddEmailAliasDialog()">close</button>
      </div>
    </confirm-dialog>
    <confirm-dialog
      id="confirmAddForwardingAddressDialog"
      ref="confirmAddForwardingAddressDialog"
      width="800"
    >
      <div slot="modal-title" class="text-white">Set Forwarding Address</div>
      <div slot="modal-body">
        <div class="container forwarding-address">
          <div class="alert alert-info">
            <p>Use this control to set or remove the account's Forwarding SMTP Address.</p>
            <p>
              The value entered must be a valid email address. If you wish to clear the Forwarding SMTP Address, press the clear button and select 'Set Forwarding Address' button.            </p>
          </div>

          <div class="form-group add-alias-cmd">
            <div class="forwarding-address-controls">
              <input
                type="text"
                class="form-control"
                placeholder="forwarding address"
                v-model="mailbox.forwardingSmtpAddress"
                v-select-all
              >

              <div class>
                <button
                  class="btn btn-primary"
                  @click="setForwardingAddress()"
                >Set Forwarding Address</button>
                <button class="btn btn-secondary" @click="mailbox.forwardingSmtpAddress = ''">Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closeAddFormwardingAddressDialog()">close</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./aliases.js"></script>
<style lang="scss" src="./aliases.scss" scoped></style>
