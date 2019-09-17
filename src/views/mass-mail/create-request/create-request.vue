<template>
  <div class="container create-request">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">mail_outline</i>
        </div>
        <h3>Create Request</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <!-- Crumbs to navigate MassMail Steps -->
          <step-navigation
            ref="stepNav"
            :current-navigation="currentView"
            @nav-click="navClick"
            :max-navigation="maxNavigation"
          ></step-navigation>
          <!-- Crumbs to navigate MassMail Steps -->

          <!-- Child view for various steps -->
          <div id="child-route-view">
            <!-- <transition name="fade"> -->
            <basic-information
              ref="stepBasicInformation"
              v-if="currentView == 'BASIC_INFORMATION'"
              v-model="model"
            ></basic-information>
            <!-- </transition>
            <transition name="fade">-->
            <audience-criteria
              ref="stepAudienceCriteria"
              v-if="currentView == 'AUDIENCE_CRITERIA'"
              v-model="model"
            ></audience-criteria>
            <!-- </transition>
            <transition name="fade">-->
            <message-contents
              ref="stepMessageContents"
              v-if="currentView == 'MESSAGE_CONTENTS'"
              v-model="model"
            ></message-contents>
            <!-- </transition> -->
            <message-summary
              ref="stepMessageSummary"
              v-if="currentView == 'MESSAGE_SUMMARY'"
              v-model="model"
            ></message-summary>

            <!-- v-if="loaded" -->
            <!-- <router-view  /> -->
          </div>
          <!-- Child view for various steps -->

          <div class="container">
            <form @submit.prevent.prevent class="submit" role="form">
              <button
                @click="navigatePrevious()"
                class="btn btn-primary"
                :class="{'disabled': getCurrentNavIndex() <= 1}"
              >
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
                <span class="ml-3">Previous Step</span>
              </button>
              <button
                class="btn btn-danger"
                @click="cancelRequest()"
                v-if="allowCancel"
              >Cancel Request</button>
              <button
                @click="navigateNext()"
                class="btn btn-primary"
                :class="{'disabled': getCurrentNavIndex() >= 4}"
                v-if="!(getCurrentNavIndex() >= 4)"
              >
                <span class="mr-3">Next Step</span>
                <i class="fa fa-chevron-right" aria-hidden="true"></i>
              </button>
              <button
                class="btn btn-primary"
                v-else
                @click="save('CREATED')"
                :disabled="!allowSubmit"
                :class="{'disabled': !allowSubmit}"
              >Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <confirm-dialog id="confirmSave" ref="confirmSave">
      <div slot="modal-title" class="text-white">Confirm: Save</div>
      <div slot="modal-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info mr-4">
              <i class="fa fa-info-circle"></i>
            </div>
            <p>
              The system would like to save your request at this time.
              The campaign will remain in an incomplete status until all required fields have been entered.
            </p>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="confirmSave()">Ok</button>
      </div>
    </confirm-dialog>

    <confirm-dialog id="confirmCancel" ref="confirmCancel">
      <div slot="modal-title" class="text-white">Confirm: Cancel Request?</div>
      <div slot="modal-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-exclamation-circle"></i>
          </div>
          <p class="ml-3">Confirm cancel current request?</p>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="confirmCancel()">Yes</button>
        <button class="btn btn-secondary" @click="cancelCancelRequest()">Cancel</button>
      </div>
    </confirm-dialog>
        
    <confirm-dialog id="confirmSubmit" ref="confirmSubmit">
      <div slot="modal-title" class="text-white">Confirm: Submit</div>
      <div slot="modal-body">
        <div class="alert alert-info">
          <div class="info mr-3">
            <i class="fa fa-exclamation-circle"></i>
          </div>
          <p class="p-3">Ready for review? Once this campaign is submitted, reviewers will be notified and left in 'Created' status until approved.</p>
          
        </div>
      </div>
      <div slot="modal-footer">
         <button class="btn btn-primary" @click="confirmSubmit()">Yes</button>
        <button class="btn btn-secondary" @click="cancelSubmit()">Cancel</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./create-request.js"></script>
<style lang="scss" src="./create-request.scss" ></style>
