<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-skull-crossbones" aria-hidden="true"></i>
        </div>
        <h3>Compromised Accounts</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="form-group">
            <label for="onyen">User Id</label>
            <input
              type="text"
              id="onyen"
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
        </div>
        <div class="list-container" v-if="compromisedAccounts && compromisedAccounts.length > 0">
          <div class="bg-primary text-white row-header">
            <div class="col">Display Name</div>
            <div class="col">OWA Enabled</div>
            <div class="col">POP Enabled</div>
            <div class="col">IMAP Enabled</div>
            <div class="col">MAPI Enabled</div>
            <div class="col">Enabled</div>
          </div>
          <div class="result-grid" v-for="(item, index) in compromisedAccounts" v-bind:key="index">
            <div class="result-cols">
              <div class="col">{{item.displayName}}</div>
              <div class="col">{{item.owaEnabled}}</div>
              <div class="col">{{item.popEnabled}}</div>
              <div class="col">{{item.imapEnabled}}</div>
              <div class="col">{{item.mapiEnabled}}</div>
              <div class="col">{{item.isEnabled}}</div>
            </div>
            <div class="e-mail">
              <div>{{item.primarySmtpAddress}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./compromised-accounts.js"></script>
<style lang="scss" src="./compromised-accounts.scss" scoped></style>
