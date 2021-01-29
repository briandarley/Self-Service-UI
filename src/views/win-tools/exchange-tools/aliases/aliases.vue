<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fa-user-circle-o" aria-hidden="true"></i>
        </div>
        <h1>Aliases</h1>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-info-circle" aria-hidden="true"></i>
          </div>
          <div>
            <p>
              This tool may be used to manage user's email aliases including, adding, removing, setting primary email alias
              <!-- , as well as manage the user's forwarding address for Office 365.-->
            </p>
            <p>Enter the Onyen for the person you wish to modify</p>
          </div>
        </div>
        <form @submit.prevent.prevent class="form-group" role="form" ref="searchForm">
          <div class="form-group">
            <div class="label-info">
              <label for="onyen" id="lblUserId" aria-label="User I D">User Id</label>
              <span class="required" id="spnUserIdRequired">Required</span>
            </div>
            <input
              type="text"
              id="onyen"
              class="form-control"
              v-select-all
              v-model="filter"
              placeholder="onyen, pid, or email"
              data-validation="{'required': 'true'}"
              ref="searchField"
              autocomplete="off"
              v-on:keyup.13="search()"
              aria-labelledby="lblUserId spnUserIdRequired"
            />
          </div>
          <div class="submit text-right">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
        </form>
        <div class="container"></div>

        <div class v-if="adUser">
          <div class="alert alert-info mt-3">
            <div class="p-3">
              <p>
                Use the radio buttons on the grid to designate the a primary alias.
                Some aliases may not be selected or removed as they are required for proper account function.
              </p>
              <p>Use the 'Add Email Alias' button to add new aliases for the selected account</p>
            </div>
          </div>
          <div class="submit text-right">
            <button class="btn btn-primary mr-2" @click="showAddEmailAliasDialog()">
              <i class="fa fa-plus-circle" aria-hidden="true"></i>
              <span class="ml-2">Add Email Alias</span>
            </button>
          </div>
          <!-- Alias List -->
          <div class="container" role="table">
            <div class="row bg-primary text-white row-header" role="rowheader">
              <div role="columnheader" class="col-1">Alias</div>
              <div role="columnheader" class="col-2 text-center">Is Primary</div>
              <div role="columnheader" class="col-3"></div>
            </div>
            <div
              class="result-grid row"
              v-for="(item, index) in emailAddresses"
              v-bind:key="item.email"
              role="row"
            >
              <div class="col-1" role="cell">
                <label :for="'alias-selection' + index">{{item.email}}</label>
              </div>
              <div class="col-2 radio-buttons text-center"  role="cell">
                <input
                  type="radio"
                  name="primary"
                  :id="'alias-selection' + index"
                  :checked="item.primary"
                  :value="item.email"
                  v-model="primary"
                  :disabled="!item.valid"
                  @change="confirmChangePrimaryAlias($event)"
                />
              </div>

              <div class="col-3 text-right"  role="cell">
                <a
                  href="#"
                  @click.prevent="confrimDeleteEntity(item)"
                  title="delete alias"
                  :disabled="!item.valid"
                  :class="{'text-disabled': !item.valid}"
                  :aria-label="'Confirm Delete alias ' + item.email"
                   v-if="allowRemove(item)"
                >
                  <i class="fa fa-trash-o"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <confirm-dialog id="confirmChangePrimaryAliasDialog" ref="confirmChangePrimaryAliasDialog">
      <div slot="modal-title" class="text-white">Confirm: Change Primary Alias?</div>
      <div slot="modal-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
          </div>
          <p>
            Confirm Set Primary Alias
            <span class="strong">{{selectedPrimarySmtp}}</span>?
          </p>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="confirmChangePrimaryAliasClick()">yes</button>
        <button class="btn btn-secondary" @click="confirmChangePrimaryAliasCancelClick()">cancel</button>
      </div>
    </confirm-dialog>
    <confirm-dialog id="confirmDelete" ref="confirmDelete">
      <div slot="modal-title" class="text-white">Confirm: Delete Alias?</div>
      <div slot="modal-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
          </div>
          <p>
            Confirm Delete Alias
            <span class="strong">{{deleteEntity.email}}</span>?
          </p>
        </div>
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
            <div class="p-3">
              <p>Use the controls below to append an alias to the selected account.</p>
              <p>
                The drop down list shown has been pre-populated by the Identity Management Team and is specific to your account profile.
                If you wish to add more aliases please send a request to the Identity Management Team.
              </p>
            </div>
          </div>
          <form @submit.prevent.prevent class="form-group add-email-alias" role="form">
            <div class="col form-group">
              <div class="label-info">
                <label for="newAlias">Alias Prefix</label>
                <span class="required">Required</span>
              </div>
              <input
                type="text"
                id="newAlias"
                class="form-control"
                placeholder="email alias"
                v-model="newAliasPrefix"
                data-validation="{'name': 'E-mail alias (prefix)','required': 'true'}"
                ref="newAlias"
                v-select-all
              />
            </div>
            <div class="col form-group">
              <div class="input-group-append">
                <span class="input-group-text">@</span>
              </div>
            </div>
            <div class="col form-group">
              <div class="label-info">
                <label for="select-domain">Domain</label>
                <span class="required">Required</span>
              </div>

              <select class="form-control" v-model="newAliasDomain" id="select-domain">
                <option v-for="item in adminProfile.adminAliases" :key="item" :value="item">{{item}}</option>
              </select>
            </div>
            

            
          </form>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="addEmailAlias()">add</button>
        <button class="btn btn-secondary" @click="closeAddEmailAliasDialog()">close</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./aliases.js"></script>
<style lang="scss" src="./aliases.scss" scoped></style>
