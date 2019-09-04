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
            <transition name="fade">
              <basic-information ref="stepBasicInformation" v-if="currentView == 'BASIC_INFORMATION'" v-model="model"></basic-information>
            </transition>
            <transition name="fade">
              <audience-criteria ref="stepAudienceCriteria" v-if="currentView == 'AUDIENCE_CRITERIA'" v-model="model"></audience-criteria>
            </transition>

            <!-- v-if="loaded" -->
            <!-- <router-view  /> -->
          </div>
          <!-- Child view for various steps -->

          <div class="container">
            <form class="submit" role="form">
              <button 
                  @click="navigatePrevious()"
                  class="btn btn-primary" 
                  :class="{'disabled': getCurrentNavIndex() <= 1}">
                <i class="fa fa-chevron-left" aria-hidden="true"></i> <span class="ml-3">Previous Step</span> 
              </button>
       

              <button 
                  @click="navigateNext()"
                  class="btn btn-primary" 
                  :class="{'disabled': getCurrentNavIndex() >= 4}" v-if="!(getCurrentNavIndex() >= 4)">
                <span class="mr-3">Next Step</span> <i class="fa fa-chevron-right" aria-hidden="true"></i>
              </button>
              <button class="btn btn-primary" v-else>Submit</button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./create-request.js"></script>
<style lang="scss" src="./create-request.scss" ></style>
