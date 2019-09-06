<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">email</i>
        </div>
        <h3>Email Sign-Up</h3>
      </div>
      <div class="card-body" v-if="viewLoaded">
        <div class="container">
          <div class="border border-primary pb-3">
            <div class="bg bg-primary text-white p-2">Mailbox Status</div>
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
                  class="text-info"
                >Please provide an existing email address for account {{userId}} to receive a notification when your UNC email request is complete.</p>
                <div class="form-group" :class="{'not-empty': model.mail.length}">
                  <label for="email" class="animated-label">Notification E-Mail Address</label>
                  <input
                    type="text"
                    class="form-control"
                    data-validation="{'name': 'Notification E-Mail','type':'email', 'minLength': 10}"
                    id="email"
                    ref="email"
                    placeholder="Email for notification upon completion"
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
        <div class="container" v-if="isDualAccountEligible">
          <div class="border border-primary mt-5">
            <div class="alert alert-info">
              <div class="info">
                <i class="fa fa-info-circle" aria-hidden="true"></i>
              </div>
              <div>
                <p>Your account was identified as having a UNC Hospital association through MIM</p>

                <p
                  v-if="!hasPrimaryAccountSelected"
                >You have no primary designation on record. You must designate which account will be displayed in the Global Address List (GAL). Until this designation is made your account will be hidden from the GAL(s).</p>

                <p
                  v-else
                >You have selected your {{primaryAccountDisplayName}} account as primary. This is the account that will be visible in the Global Address List (GAL). If you would like to change this you can do so below.</p>
              </div>
            </div>
            <form @submit.prevent.prevent class="p-3 pb=0" role="form">
              <h4 class="text-primary">Choose Primary Mailbox Designation</h4>

              <div class="radio-buttons mx-5 mt-2 mb-4">
                <div class="form-group">
                  <input
                    type="radio"
                    id="priary-designation-none"
                    value="0"
                    name="priary-designation"
                    v-model="selectedPrimaryDesignation"
                    disabled="disabled"
                  />
                  <label for="priary-designation-none">None</label>
                </div>
                <div class="form-group">
                  <input
                    type="radio"
                    id="priary-designation-unc"
                    value="1"
                    name="priary-designation"
                    v-model="selectedPrimaryDesignation"
                  />
                  <label for="priary-designation-unc">UNC</label>
                </div>
                <div class="form-group">
                  <input
                    type="radio"
                    id="priary-designation-unc-health"
                    value="2"
                    name="priary-designation"
                    v-model="selectedPrimaryDesignation"
                  />
                  <label for="priary-designation-unc-health">UNC Health Care</label>
                </div>

                
              </div>
            </form>
            <div class="submit text-right m-3 ml-0">
              <button class="btn btn-primary mr-1" @click="updateDualRoleStatus()">submit</button>
              <button class="btn btn-secondary" @click="clear()">cancel</button>
            </div>
          </div>
        </div>
        <div class="container mt-3" v-if="showInEligible">
          <div class="alert alert-warning">
            <div class="info">
              <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
            </div>
            <p
              class="mt-3 mb-4"
            >Although you have both UNC and UNC Health Care email accounts, your department is not currently eligible for an option to choose a primary account.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./email-signup.js"></script>
<style lang="scss" src="./email-signup.scss" scoped></style>
