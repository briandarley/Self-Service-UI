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
            <div>
              <p>MFA Reset allows administrators to cycle the status of a user's Office365 MFA. The process momentarily disables MFA and immediately re-enables MFA for the selected account. Cycling Office365 MFA will require the user to re-verify their secondary verification for access to Office365.</p>
            </div>
          </div>

          <div class="form-group">
            <label for="onyen">Search</label>
            <input
              type="text"
              id="onyen"
              class="form-control"
              v-select-all
              placeholder="onyen"
              v-model="filter"
              v-on:keyup.13="search()"
            />
          </div>
          <div class="submit text-right">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>

          <transition name="fade">
            <div class="mfa-user-status-results" v-if="mfaMethodType">
              <div class="bg-primary text-white row-header">
                <div class="col">Display Name</div>
                <div class="col">E-Mail</div>
                <div class="col">Status</div>
              </div>
              <div class="result-grid">
                <div class="row">
                  <div class="col">{{mfaMethodType.displayName}}</div>
                  <div class="col">{{mfaMethodType.userPrincipalName}}</div>
                  <div class="col">{{currentStatus}}</div>
                </div>
                <div class="mfa-method" v-if="showContactMethod">
                  <p>
                    <span
                      class="text-primary"
                    >* Last Updated {{mfaMethodType.createDate | formatDate}}</span>
                  </p>
                  <div>
                    <label>Phone Number</label>
                    <span>{{mfaMethodType.phoneNumber}}</span>
                  </div>
                  <div>
                    <label>Alt Number</label>
                    <span>{{mfaMethodType.alternativePhoneNumber}}</span>
                  </div>
                  <div>
                    <label>Device Name</label>
                    <span>{{mfaMethodType.deviceName}}</span>
                  </div>
                  <div>
                    <label>MFA Method</label>
                    <span>{{mfaMethodType.methodType}}</span>
                  </div>
                </div>
                <div class="mfa-method" v-else>
                  <p>
                    <span
                      class="text-primary"
                    >* Last Updated {{mfaMethodType.createDate | formatDate}}</span>
                  </p>
                  <div>
                    <label>Phone Number</label>
                    <span>Not Available</span>
                  </div>
                  <div>
                    <label>Alt Number</label>
                    <span>Not Available</span>
                  </div>
                  <div>
                    <label>Device Name</label>
                    <span>Not Available</span>
                  </div>
                  <div>
                    <label>MFA Method</label>
                    <span>Not Available</span>
                  </div>
                </div>
              </div>
              <div class="result-grid"></div>
              <div class="submit text-center mt-4">
                <button
                  type="button"
                  class="btn btn-danger icon-button"
                  aria-label="Left Align"
                  @click="resetMfa()"
                >
                  <span>
                    <i data-v-1da7b41f class="material-icons">undo</i>
                  </span>
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./mfa-reset.js"></script>
<style lang="scss" src="./mfa-reset.scss" scoped></style>
