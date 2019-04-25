<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">undo</i>
        </div>
        <h3>MFA Reset</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <p class="mt-4">MFA Reset allows administators to cycle the status of a user's Office365 MFA. The process momentarily disables MFA and immediately re-enables MFA for the selected account. Cycling Office365 MFA will require the user to re-verify their secondary verification for access to Office365.</p>
          
          </div>

          <div class="form-group">
            <label for>Search</label>
            <input
              type="text"
              class="form-control"
              v-select-all
              placeholder="onyen"
              v-model="filter"
            >
          </div>
          <div class="submit text-right" >
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./mfa-reset.js"></script>
<style lang="scss" src="./mfa-reset.scss" scoped></style>
