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
          v-on:keyup.13="search()">
          
        </div>
        <div class="submit text-right">
          <button class="btn btn-primary mr-1" @click="search()">Search</button>
          <button class="btn btn-secondary" @click="clear()">Clear</button>
        </div>

        <div class="container" v-if="adUser">
          <div class="alert alert-info mt-3">
            <p>Use the radio buttons on the grid to designate the a primary alias.</p>
            <p>Some aliases may not be selected or removed as they are required for proper account function.</p>
          </div>

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
                @change="confirmSetPrimary($event)"
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

          <div class="mt-5" v-if="adminProfile.adminAliases.length">
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
                <button class="btn btn-primary" @click="addAlias()">Add</button>
                <button class="btn btn-secondary" @click="newAliasPrefix = ''">Clear</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <confirm-dialog id="confirmDelete" ref="confirmDelete">
      <div slot="modal-title">Confirm: Delete Alias?</div>
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
    <confirm-dialog id="confirmSetPrimaryDialog" ref="confirmSetPrimaryDialog">
      <div slot="modal-title">Confirm: Set Primary Alias?</div>
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
        <button class="btn btn-primary" @click="setPrimaryEntityClick()">yes</button>
        <button class="btn btn-secondary" @click="setPrimaryCancelClick()">cancel</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./aliases.js"></script>
<style lang="scss" src="./aliases.scss" scoped></style>
