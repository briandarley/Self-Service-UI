<template>
  <div class="container">
    <div class="card card-icon">
      <!-- bg-primary text-white -->
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">email</i>
        </div>
        <h3>Email Account Request</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent.prevent class="validation-form" autocomplete="off">
          <p
            class="text-info"
          >Please provide an existing email address to receive a notification when your UNC email request is complete.</p>
          <div class="form-group" :class="{'not-empty': model.mail.length}">
            <input
              type="text"
              class="form-control"
              data-validation="{&quot;name&quot;: &quot;Notification E-Mail&quot;,&quot;type&quot;:&quot;email&quot;, &quot;minLength&quot;: 10}"
              ref="email"
              v-model="model.mail"
              v-select-all
              v-focus
            >
            
            <label for="user" class="animated-label">Notification E-Mail Address</label>
          </div>

          <div class="submit">
            <button class="btn btn-secondary pull-right ml-1" @click="clear()">clear</button>
            <button class="btn btn-primary pull-right" @click="click()">submit</button>
          </div>
        </form>
      </div>
    </div>

    <div class="card card-icon">
      <!-- bg-primary text-white -->
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">email</i>
        </div>
        <h3>Mailbox successfully created</h3>
      </div>
      <div class="card-body" v-if="provisionInfo">
        <div class="row">
          <div class="col">
            <span class="label strong mr-3">Onyen:</span>
            <span class>{{provisionInfo.uid}}</span>
          </div>
          <div class="col">
            <span class="label strong mr-3">Create Date:</span>
            <span class>{{provisionInfo.submittedDate}}</span>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <span class="label strong mr-3">Mailbox Type:</span>
            <span class>{{provisionInfo.malboxType}}</span>
          </div>
          <div class="col">
            <span class="label strong mr-3">Status:</span>
            <span class>{{provisionInfo.status}}</span>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <span class="label strong mr-3">Created By:</span>
            <span class>{{provisionInfo.createUser}}</span>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <span class="label strong mr-3">Response Email:</span>
            <span class>{{provisionInfo.responseEmail}}</span>
          </div>
        </div>

        
      </div>
      <div class="card-body" v-else></div>
    </div>

    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">mail</i>
        </div>
        <h3>Dual Account Verify</h3>
      </div>
      <div class="card-body">
        <div class="info text-warning">
          <i class="fa fa-exclamation-triangle"></i>
        </div>
        <p>Do you really want two email accounts?</p>
        <p>This can cause problems if you don't have a specific need for two accounts, like using resources (calendar, shared mailboxes, etc.) in both UNC Health Care Active Directory and UNC Active Directory.</p>
        <p>If you choose to continue creating a second account, you will be forced to pick one as primary and it will be the only account advertised in the Global Address List(GAL).</p>

        <div class="submit">
          <button class="btn btn-primary pull-right" @click="click()">continue</button>
        </div>
      </div>
    </div>

    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">mail</i>
        </div>
        <h3>Primary Designation</h3>
      </div>
      <div class="card-body">
        <ul class="radio-buttons mx-5 mt-2 mb-4">
          <li><input type="radio" id="priary-designation-none" value="none" name="priary-designation"  checked><label for="priary-designation-none">None</label></li>
          <li><input type="radio" id="priary-designation-unc" value="unc" name="priary-designation"  checked><label for="priary-designation-unc">UNC</label></li>
          <li><input type="radio" id="priary-designation-unc-health" value="unc" name="priary-designation" checked><label for="priary-designation-unc-health">Unc Health Care</label></li>
          
        </ul>

        <p>You have no primary designation on record. You must designate which account will be displayed in the Global Address List (GAL). Until this designation is made your account will be hidden from the GAL(s).</p>
        <p>You have selected your {rdioButtonListPrimaryAccount.SelectedItem.Text} account as primary. This is the account that will be visible in the Global Address List (GAL). If you would like to change this you can do so below.</p>

        <p>
          You have selected your {rdioButtonListPrimaryAccount.SelectedItem.Text} account as primary.
          This is the account that will be visible in the Global Address List (GAL). If you would like to change this you can do so below.
        </p>

        <div class="submit mt-5">
            <button class="btn btn-secondary pull-right ml-1" @click="clear()">clear</button>
            <button class="btn btn-primary pull-right" @click="click()">submit</button>
          </div>
      </div>
    </div>

<div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">mail</i>
        </div>
        <h3>Dual Account</h3>
      </div>
      <div class="card-body">

        <p>Although you have both UNC and UNC Health Care email accounts, your department is not currently eligible for an option to choose a primary account.</p>
        




      </div>
    </div>

    
  </div>
</template>
<script src="./email-signup.js"></script>
<style lang="scss" src="./email-signup.scss" scoped></style>
