<template>
  <div class="border border-primary mt-5" v-if="hasDualAccount">
    
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
    <form @submit.prevent.prevent class="p-3 pb=0" role="form" v-if="!showInEligible">
      <h4 class="text-primary">Choose Primary Mailbox Designation</h4>

      <div class="radio-buttons mx-5 mt-2 mb-4" role="radiogroup" >
        <div class="form-group" role="radio" :aria-checked="selectedPrimaryDesignation == 0? true:false">
          <input
            type="radio"
            id="priary-designation-none"
            value="0"
            v-model="selectedPrimaryDesignation"
            disabled="disabled"
            tabindex="-1"
          />
          <label for="priary-designation-none">None</label>
        </div>
        <div class="form-group" role="radio" :aria-checked="selectedPrimaryDesignation == 1? true:false">
          <input
            type="radio"
            id="priary-designation-unc"
            value="1"
            name="priary-designation"
            v-model="selectedPrimaryDesignation"
            :tabindex="(selectedPrimaryDesignation == 1 || selectedPrimaryDesignation == 0) ?  0: -1"
            
          />
          <label for="priary-designation-unc">UNC</label>
        </div>
        <div class="form-group" role="radio" :aria-checked="selectedPrimaryDesignation == 2? true:false">
          <input
            type="radio"
            id="priary-designation-unc-health"
            value="2"
            name="priary-designation"
            v-model="selectedPrimaryDesignation"
            :tabindex="selectedPrimaryDesignation == 2 ?  0: -1"
            
          />
          <label for="priary-designation-unc-health">UNC Health Care</label>
        </div>
      </div>

      <div class="submit text-right mt-5">
      <button class="btn btn-primary mr-1" @click="updateDualRoleStatus()">submit</button>
      <button class="btn btn-secondary" @click="clear()">cancel</button>
    </div>
    </form>
    


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
</template>
<script src="./dual-role-assignment.js"></script>
<style lang="scss" src="./dual-role-assignment.scss" scoped></style>
