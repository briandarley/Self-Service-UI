<template>
  <div>
    <div class="alert alert-info">
      <div class="info">
        <i class="fa fa-info-circle"></i>
      </div>
      <div>
        <p>
          Verify if a recipient has received the campaign
          <br />
          <span class="strong">Subject: {{campaign.subject}}</span>
        </p>
        <p>This tool may be used to verify if the indicated user has received the campaign.</p>
        <p>This tool checks if the user has an email with a subject matching the campaign subject for date of campaign transmission.</p>
      </div>
    </div>
    <div class="form-group">
      <label for="onyen">Onyen</label>
      <div class="d-flex">
        <input
          type="text"
          class="form-control flex-grow-1"
          placeholder="Onyen"
          v-select-all
          v-model="onyen"
          v-on:keyup.13="search()"
        />
        <div class="flex-grow-0 ml-3">
          <div v-if="!verified && hasVerified">
            <i class="fa fa-times-circle text-danger"></i>
          </div>
          <div v-if="verified">
            <i class="fa fa-check-circle text-success"></i>
          </div>
          <div v-if="!hasVerified">
            <i class="fa fa-times-circle invisible"></i>
          </div>
        </div>
      </div>
      <div v-if="!verified && hasVerified" class="text-danger">No matching record found</div>
      <div v-if="verified" class="text-success">Found matching record</div>
    </div>
    <div class="text-right d-flex-grow-1">
      <button class="btn btn-primary mr-1" @click="search()">Search</button>
      <button class="btn btn-secondary" @click="clear()">Clear</button>
    </div>
  </div>
</template>
<script src="./confirm-verify.js"></script>
<style lang="scss" src="./confirm-verify.scss" scoped></style>
