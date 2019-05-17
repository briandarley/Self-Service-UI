<template>
   <div class="pb-100" v-if="data">
    <div class="account-details">
      <h4 class="text-secondary">General Information</h4>
      <div>
        <span class="label">Primary SMTP</span>
        <span>{{data.primarySmtp}}</span>
      </div>
      <div>
        <span class="label">Forwarding SMTP Address</span>
        <span v-if="data.forwardingAddress">{{data.forwardingAddress}}</span>
        <span v-else>Not Available</span>
      </div>
{{data}}

  </div>
   </div>
</template>
<script src="./office-365-info.js"></script>
<style lang="scss" src="./office-365-info.scss" scoped></style>
