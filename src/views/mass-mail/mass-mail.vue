<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">contact_mail</i>
        </div>
        <h1>Mass Mail</h1>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p
                class="strong"
              >Mass E-mail is a tool for requesting and distributing official UNC-Chapel Hill messages.</p>
              <p>This system provides support for mailing to predefined, broad sectors of the University community. Approved messages can be sent to all students, as well as to all employees. Some filtering is available to target specific subpopulations of recipients.</p>
              <!-- 
                User can update MassMail flag here 
                https://account.itsapps.unc.edu/onyen/update
               -->
            </div>
          </div>
         
          

          <div>
            <p class="strong">Things to know before creating a request:</p>

            <ul>
              <li>
                Review the
                <a
                  href="https://help.unc.edu/sp?id=kb_article&sys_id=0d1695d5dba77b401fb6ef070596194a"
                  target="_blank"
                >Mass Email Requirements</a> for information about how the system works.
              </li>
              <li>
                Details on human subject research requirements, recycling old messages, and other questions can be found in the
                <a
                  href="https://help.unc.edu/sp?id=kb_article&sys_id=0d1695d5dba77b401fb6ef070596194a"
                  target="_blank"
                >Mass Email FAQ.</a>
              </li>
              <li>All requests must be approved and may be denied if there are concerns with the content or images. See the Appropriate Use section of the Mass Email Requirements for details.</li>
              <li>Message approval can take 1-3 days.</li>
              <li>
                 Have questions concerning the approval of a specific MassMail? Please contact the approvers group
                <a href="mailto:MassMail-Approvers@unc.edu">MassMail-Approvers@unc.edu</a>
              </li>
            </ul>
          </div>
          

          <div>
            <p>
              To begin, choose
              <router-link :to="{name: 'create-request'}">Create Request</router-link> from the menu on the left.
            </p>
          </div>
          <form
            @submit.prevent.prevent
            v-if="activeCampaigns && activeCampaigns.length"
            role="form"
          >
            <div class="alert alert-info">
              <div class="info">
                <i class="fa fa-info-circle"></i>
              </div>
              <div>
                <p               
                >The system has detected unfinished MassMail campaigns. Select from the list to continue editing.</p>
                
                <p>Note: Unfinished campaigns may periodically be removed after a period of time</p>
              </div>
            </div>
            <div class="select-list">
              
              <div class="form-group">
                <label
                  for="seletedMassMail"
                  class="strong"
                >Select from the drop-down to edit an existing MassMail previously entered.</label>
                <div class="control-inline">
                  <select class="form-control" v-model="seletedMassMail" id="seletedMassMail">
                    <option disabled value>Select an Existing MassMail to edit</option>
                    <option
                      v-for="item in activeCampaigns"
                      :key="item.id"
                      :value="item.id"
                    >{{item.id}} - {{item.subject}}</option>
                  </select>
                  <div class="group-btns">
                    <button
                      class="btn btn-primary"
                      @click="editMassMail"
                      :disabled="!seletedMassMail"
                    >Go</button>
                    <button
                      class="btn btn-danger"
                      @click="deleteMassMail"
                      :disabled="!seletedMassMail"
                    >Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div class="text-right">
            <router-link :to="{name: 'create-request'}" class="btn btn-primary ico">
              <span class>
                <i data-v-0fe20b93 class="fa fa-newspaper-o" aria-hidden="true"></i>
              </span>
              Create New Request
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <confirm-dialog id="confirmDelete" ref="confirmDelete">
      <div slot="modal-title" class="text-white">Confirm: Delete Campaign?</div>
      <div slot="modal-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
          </div>
          <p>Confirm Delete?</p>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-danger" @click="removeEntityClick">yes</button>
        <button class="btn btn-secondary" @click="removeEntityCancelClick">cancel</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./mass-mail.js"></script>
<style lang="scss" src="./mass-mail.scss" scoped></style>
