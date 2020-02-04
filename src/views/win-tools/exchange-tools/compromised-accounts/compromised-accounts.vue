<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-skull-crossbones" aria-hidden="true"></i>
        </div>
        <h1>Compromised Accounts</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent.prevent class="container" role="form" ref="submitForm">
          <div class="form-group">
            <div class="label-info">
              <label for="searchField" id="lblUserId" aria-label="User I D">User Id</label>
              <span class="required" id="spnUserIdRequired">Required</span>
            </div>
            
            <input
              type="text"
              id="searchField"
              class="form-control"
              v-select-all
              v-model="filter"
              placeholder="onyen"
              v-on:keyup.13="search()"
              data-validation="{'required': 'true'}"
              ref="searchField"
              autocomplete="off"
              aria-labelledby="lblUserId spnUserIdRequired"
            />
          </div>
          <div class="submit text-right">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
        </form>
        <div class="list-container" v-if="compromisedAccounts && compromisedAccounts.length > 0" role="table">
          <div class="bg-primary text-white row-header" role="rowheader">
            <div role="columnheader" class="col">Display Name</div>
            <div role="columnheader" class="col">OWA Enabled</div>
            <div role="columnheader" class="col">POP Enabled</div>
            <div role="columnheader" class="col">IMAP Enabled</div>
            <div role="columnheader" class="col">MAPI Enabled</div>
            <div role="columnheader" class="col">Enabled</div>
          </div>
          <div class="result-grid" v-for="(item, index) in compromisedAccounts" v-bind:key="index" role="rowgroup">
            <div class="result-cols" role="row">
              <div row="cell" class="col">{{item.displayName}}</div>
              <div row="cell" class="col">{{item.owaEnabled}}</div>
              <div row="cell" class="col">{{item.popEnabled}}</div>
              <div row="cell" class="col">{{item.imapEnabled}}</div>
              <div row="cell" class="col">{{item.mapiEnabled}}</div>
              <div row="cell" class="col">{{item.isEnabled}}</div>
            </div>
            <div class="e-mail" role="role">
              <div role="cell">{{item.primarySmtpAddress}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./compromised-accounts.js"></script>
<style lang="scss" src="./compromised-accounts.scss" scoped></style>
