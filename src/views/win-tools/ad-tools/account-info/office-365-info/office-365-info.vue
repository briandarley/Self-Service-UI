<template>
   <div class="pb-100" v-if="data">
    <div class="account-details row-odd">
      <h2 class="text-secondary">General Information</h2>
      <div>
        <span class="label">Primary SMTP</span>
        <span>{{data.primarySmtpAddress}}</span>
      </div>
      <div>
        <span class="label">Forwarding SMTP Address</span>
        <span v-if="data.forwardingSmtpAddress">{{data.forwardingSmtpAddress}}</span>
        <span v-else>Not Available</span>
      </div>
      <div>
        <span class="label">Litigation Hold Status</span>
        <span v-if="data.litigationHoldEnabled === true">{{data.litigationHoldEnabled}}</span>
        <span v-else>Not Set</span>
      </div>
      <div>
        <span class="label">Litigation Hold Date</span>
        <span v-if="data.litigationHoldDate">{{data.litigationHoldDate | formatDate}}</span>
        <span v-else>Not Available</span>
      </div>
      <div>
        <span class="label">Office 365 Licenses</span>
        <div v-if="data.licenses && data.licenses.length">
            <div v-for="(item, index) in data.licenses" :key="index">
              {{item}}
            </div>
        </div>
        <span v-else>Not Available</span>
      </div>


  </div>
   </div>
</template>
<script src="./office-365-info.js"></script>
<style lang="scss" src="./office-365-info.scss" scoped></style>
