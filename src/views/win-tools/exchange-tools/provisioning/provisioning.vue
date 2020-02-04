<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">email</i>
        </div>
        <h1>Provisioning</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent.prevent role="form" ref="submitForm">
          <div class="form-group">
            <div class="label-info">
              <label for="searchField">Search Provision/Initiate Provision</label>
              <span class="required">Required</span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Onyen or PID"
              id="searchField"
              v-select-all
              v-model="filter"
              data-validation="{'required': 'true', 'message': 'Search field required'}"
              ref="searchField"
              v-on:keyup.13="search()"
              autocomplete="off"
            />
          </div>
          <div class="text-right my-3">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
        </form>

        <transition name="fade">
          <div v-if="provisionData.status">
            <div
              class="provision-history"
              v-if="provisionData.status == 'Notified' || provisionData.status == 'Completed'"
            >
              <div class="alert alert-info">
                <div class="info">
                  <i class="fa fa-info-circle"></i>
                </div>
                <div>
                  <p>
                    The provisioning information presented indicates provisioning status and when a confirmation email was sent.
                    The below status field indicates the final provisioning status of the account. Status Detail indicates the last step of the provisioning process completed. 
                    </p>
                    <p>
                      In some circumstances it may become necessary to reprovision a person's Office 365 account. Use the button 'Reprovision' to reinitialize the provisioning process for the entered user. 
                    </p>

                
                </div>
              </div>

              <div class="provision-record-detail">
                <div>
                  <span class="strong">Job Type</span>
                  <span>{{provisionData.jobType}}</span>
                </div>
                <div>
                  <span class="strong">Mailbox Type</span>
                  <span>{{provisionData.mailboxType}}</span>
                </div>
                <div>
                  <span class="strong">Submitted</span>
                  <span
                    v-if="provisionData.submittedDate"
                  >{{provisionData.submittedDate | formatDate}}</span>
                </div>
                <div>
                  <span class="strong">Created</span>
                  <span v-if="provisionData.createdDate">{{provisionData.createdDate | formatDate}}</span>
                </div>
                <div>
                  <span class="strong">Notified</span>
                  <span
                    v-if="provisionData.notifiedDate"
                  >{{provisionData.notifiedDate | formatDate}}</span>
                </div>
                <div>
                  <span class="strong">Completed</span>
                  <span
                    v-if="provisionData.completedDate"
                  >{{provisionData.completedDate | formatDate}}</span>
                </div>
                <div>
                  <span class="strong">Status</span>
                  <span>{{provisionData.status}}</span>
                </div>
                <div>
                  <span class="strong">Status Detail</span>
                  <span>{{provisionData.statusDetail}}</span>
                </div>
                <div>
                  <span class="strong">Submitted By</span>
                  <span>{{provisionData.submittedBy}}</span>
                </div>

                <div class="submit">
                  <button class="btn btn-primary" @click="confimReprovisionAccount()">Reprovision</button>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="alert alert-info">
                <div class="info">
                  <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                </div>
                <div>
                  <p>
                    The provisioning process for account
                    <span class="strong">{{provisionData.onyen}}</span> is still processing.
                  </p>
                  <p>
                    The request was submitted on
                    <span
                      class="strong"
                    >{{provisionData.submittedDate | formatDate}}</span>
                    The current status of the request is
                    <span
                      class="strong"
                    >{{provisionData.status}}</span>
                  </p>
                </div>
              </div>
            </div>

            <dual-role-assignment :provisionInfo="provisionData" :onyen="provisionData.onyen"></dual-role-assignment>
          </div>
        </transition>

        <div class="container">
          <transition name="fade">
            <div v-if="showNewProvision">
              <div v-if="!enterEmailResponse">
                <div class="alert alert-info">
                  <div class="info">
                    <i class="fa fa-question-circle" aria-hidden="true"></i>
                  </div>
                  <div id="request-new-provision-notice">
                    <p>User {{userLdap.displayName}}, Onyen {{userLdap.uid}}, PID {{userLdap.pid}} does not have an e-mail provisioned.</p>
                    <p
                      class="strong"
                    >Would you like to provision an e-mail account for {{userLdap.displayName}} at this time?</p>
                  </div>
                </div>
                <div class="submit text-right">
                  <button class="btn btn-primary" @click="nextStep()">Provision Record</button>
                </div>
              </div>
              <div class="additional-emails" v-if="enterEmailResponse">
                <div class="alert alert-info">
                  <div class="info">
                    <i class="fa fa-info-circle" aria-hidden="true"></i>
                  </div>
                  <div>
                    <p>
                      When the provisioning process has completed,
                      the owner of the e-mail account should be notified. In addition we can notify you upon completion of this request.
                      If you do not wish to be notified, simply remove your e-mail from the list. You may also notify additional persons by entering the e-mail in the field below and click 'Add'
                      When you're ready click the submit button.
                    </p>
                    <br />
                  </div>
                </div>
                <div class="input-controls">
                  <div class="form-group form-inline">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="notify e-mail address"
                      v-model="emailEntry"
                    />
                    <div class="buttons">
                      <button class="btn btn-primary" @click="addEmail()">Add</button>
                      <button class="btn btn-secondary" @click="emailEntry = ''">Clear</button>
                    </div>
                  </div>
                  <div class="form-group form-inline">
                    <select name id class="form-control" v-model="selectedEmail">
                      <option v-for="item in emailResponse" :key="item">{{item}}</option>
                    </select>
                    <div class="buttons">
                      <button
                        class="btn btn-primary pull-right"
                        @click="removeSelectedEmail()"
                      >Remove</button>
                    </div>
                  </div>
                </div>
                <div class="submit text-right m-4">
                  <button class="btn btn-primary mr-1" @click="submit()">Submit</button>
                  <button class="btn btn-secondary" @click="clear()">Cancel</button>
                </div>
              </div>
              <br />
            </div>
          </transition>
          <transition name="fade">
            <div v-if="showNoLdapRecord">
              <div class="alert alert-warning">
                <div class="info">
                  <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
                </div>
                <div>
                  <p>
                    The system tried to find a user with an id of '
                    <span class="strong">{{filter}}</span>' but no records were found in provision history nor could the system locate an LDAP record matching that criteria.
                  </p>
                  <p>Please check the id entered and try your request again</p>
                  <br />
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <confirm-dialog id="confirmAction" ref="confirmAction" width="800">
      <div
        slot="modal-title"
        class="text-white"
      >Confirm Re-Provision : Onyen {{provisionData.onyen}}</div>
      <div slot="modal-body">
        <p>Would you like to reprovision mailbox for account {{provisionData.onyen}} at this time?</p>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="reprovisionAccount()">Confirm</button>
        <button class="btn btn-secondary" @click="closeConfirmAction()">Close</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./provisioning.js"></script>
<style lang="scss" src="./provisioning.scss" scoped></style>
