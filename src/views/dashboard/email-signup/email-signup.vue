<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">email</i>
        </div>
        <h1>Email Sign-Up</h1>
      </div>
      <div class="card-body" v-if="viewLoaded">
        <div class="container">
          <div class="border border-primary pb-3">
            <div class="bg bg-primary">
              <h2 class="text-white p-2">Mailbox Status</h2>
            </div>
            <!-- Failed to load, missing LDAP/AD record -->
            <div class="container" v-if="!hasValidLdapRecord">
              <div class="alert alert-danger">
                <div class="info">
                  <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                </div>
                <p class="pt-4 pb-3">
                  The system was unable to retrieve the LDAP record for '{{userId}}'
                  <br />LDAP and AD records are required to properly provision an account for email.
                </p>
              </div>
            </div>
            
            <!-- New request -->
            <form @submit.prevent.prevent class="container" v-if="isNewRequest" role="form" ref="submitForm">
              <div autocomplete="off">
                <p
                  
                >Please provide an existing email address for account {{userId}} to receive a notification when your UNC email request is complete.</p>
                <div class="form-group" :class="{'not-empty': model.mail.length}">
                  <label for="email" class="animated-label" id="lblNewRequest">Notification E-Mail Address</label>
                  <input
                    type="text"
                    class="form-control"
                    data-validation="{'name': 'Notification E-Mail','type':'email', 'minLength': 10}"
                    id="email"
                    ref="email"
                    placeholder="Existing email to receive notification"
                    aria-labelledby="lblNewRequest"
                    v-model="model.mail"
                    v-select-all
                    v-focus
                    v-on:keyup.13="submitNewProvisionRequest()"
                  />
                </div>

                <div class="submit text-right">
                  <button class="btn btn-primary mr-1" @click="submitNewProvisionRequest()">submit</button>
                  <button class="btn btn-secondary" @click="clear()">clear</button>
                </div>
              </div>
            </form>
            <div class="container" v-if="isProvisionRecord">
              <div class="mt-2">
                <h5 class="text-primary" v-if="isMailboxCreated">Mailbox successfully created</h5>
                <h5 class="text-primary" v-else>Mailbox creation processing...</h5>
              </div>

              <div class="row">
                <div class="col">
                  <span class="label strong mr-3">Onyen:</span>
                  <span class>{{provisionInfo.onyen}}</span>
                </div>
                <div class="col">
                  <span class="label strong mr-3">Create Date:</span>
                  <span class>{{provisionInfo.submittedDate | formatDate}}</span>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <span class="label strong mr-3">Mailbox Type:</span>
                  <span class>{{provisionInfo.mailboxType}}</span>
                </div>
                <div class="col">
                  <span class="label strong mr-3">Status:</span>
                  <span class>{{provisionInfo.status}}</span>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <span class="label strong mr-3">Created By:</span>
                  <span class>{{provisionInfo.submittedBy}}</span>
                </div>
              </div>

              <div class="row">
                <div class="col">
                  <span class="label strong mr-3">Response Email:</span>
                  <span v-if="provisionInfo.emailAddress">{{provisionInfo.emailAddress}}</span>
                  <span v-else>Not Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <dual-role-assignment 
              @updatedDualRoleStatus="onUpdatedDualRoleStatus" 
              :provisionInfo="provisionInfo"
              :onyen="userId"></dual-role-assignment>
        
      </div>
    </div>
  </div>
</template>
<script src="./email-signup.js"></script>
<style lang="scss" src="./email-signup.scss" scoped></style>
