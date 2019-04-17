<template>
  <div class="container">
    <div class="alert alert-info">
      <div class="info">
        <i class="fa fa-info-circle"></i>
      </div>
      <p>Enter the user's Onyen to retrieve the current MFA status for the selected user.</p>
      <p>
        Toggle MFA Exempt status to enable/disable the selected user's MFA status, select an exemption end date (Default is 7 days).
        If you choose not to specify a date, the exemption status will be considered indefinitely. You'll then need to enter an incident number along with a reason for auditing purposes.
      </p>
    </div>

    <div class="form-group">
      <label for>Search</label>
      <input type="text" class="form-control" v-select-all placeholder="onyen" v-model="filter">
    </div>
    <div class="submit text-right">
      <button class="btn btn-primary mr-1" @click="search()">Search</button>
      <button class="btn btn-secondary" @click="clear()">Clear</button>
    </div>

    <div class="mfa-user-status-results" v-if="mfaAccountStatus">
      <div class="bg-primary text-white row-header">
        <div class="col">PID</div>
        <div class="col">Display Name</div>
        <div class="col">MFA Enabled</div>
        <div class="col">MFA Exempt Status</div>
       
      </div>
      <div class="result-grid" >
          <div class="col">{{mfaAccountStatus.pid}}</div>
          <div class="col">{{mfaAccountStatus.displayName}}</div>
          <div class="col">{{mfaAccountStatus.mfaEnabled}}</div>
          <div class="col">
            <toggle-switch class="" @checkChange="mfaStatusChanged" :value="mfaAccountStatus.mfaEnabled" :label="label"></toggle-switch>
            
          </div>
          
          
      </div>
    </div>
    
  </div>
</template>
<script src="./mfa-modify-account.js"></script>
<style lang="scss" src="./mfa-modify-account.scss" scoped></style>
