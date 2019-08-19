<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">email</i>
        </div>
        <h3>Provisioning</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="form-group">
            <label for="searchField">Search Provision/Initiate Provision</label>
            <input
              type="text"
              class="form-control"
              placeholder="Onyen or PID"
              id="searchField"
              v-select-all
              v-model="filter"
              v-on:keyup.13="search()"
            />
          </div>
          <div class="text-right my-3">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
        </div>

        <transition name="fade">
          <div v-if="provisionData">
            <div
              class="provision-history"
              v-if="provisionData.status == 'Notified' || provisionData.status == 'Completed'"
            >
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
                <span v-if="provisionData.notifiedDate">{{provisionData.notifiedDate | formatDate}}</span>
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
          </div>
        </transition>

        <div class="container">
          <transition name="fade">
            <div v-if="showNewProvision">
              <div v-if="!enterEmailResponse">
                <div class="alert alert-info">
                  <div class="info">
                    <i class="fa fa-question-circle"></i>
                  </div>
                  <div>
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
              <div class="container additional-emails" v-if="enterEmailResponse">
                <div class="alert alert-info">
                  <div class="info">
                    <i class="fa fa-info-circle"></i>
                  </div>
                  <div>
                    <p>
                      When the provisioning prcess has completed,
                      the owner of the e-mail account should be notified. In addition we can notify you upon completion of this request.
                      If you do not wish to be notified, simply remove your e-mail from the list. You may also notify additional persons by entering the e-mail in the field below and click 'Add'
                      When you're ready click the submit button.
                    </p>
                    <br />
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
                  </div>
                </div>
                <div class="submit text-right">
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
                  <i class="fa fa-exclamation-triangle"></i>
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
  </div>
</template>
<script src="./provisioning.js"></script>
<style lang="scss" src="./provisioning.scss" scoped></style>
