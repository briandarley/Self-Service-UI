<template>
  <div v-if="data">
    <div class="account-details">
      <h3 class="text-secondary">Dual Role Info</h3>
      <div>
        <span class="label">Is Dual Account</span>
        <span v-if="data.dualRoleUser">{{data.dualRoleUser.primaryDesignation > 0 | toYesNo}}</span>
        <span v-else>No</span>
      </div>
      <div v-if="data.dualRoleUser && data.dualRoleUser.primaryDesignation > 0">
        <div>
          <span class="label">Primary Designation</span>
          <span>{{data.dualRoleUser.primaryDesignation | toPrimaryDesignation}}</span>
        </div>
        <div>
          <span class="label">Detection Date</span>
          <span>{{data.dualRoleUser.detectionDateTime | formatDate}}</span>
        </div>
        <div v-if="data.dualRoleUser.hospitalUser">
          <span class="label">UNCH DN</span>
          <span>{{data.dualRoleUser.hospitalUser.userDn}}</span>
        </div>
      </div>
    </div>

    <div class="account-details mt-4" v-if="data.userDetail">
      <h3 class="text-secondary">General Information</h3>
      <div>
        <span class="label">Onyen</span>
        <span>{{data.userDetail.samAccountName}}</span>
      </div>
      <div>
        <span class="label">Name</span>
        <span>{{data.userDetail.name}}</span>
      </div>
      <div>
        <span class="label">Primary SMTP</span>
        <span>{{data.userDetail.mail}}</span>
      </div>
      <div>
        <span class="label">Alternate Emails</span>
        <div>
          <div v-for="item in data.userDetail.proxyAddresses" :key="item">{{item}}</div>
        </div>
      </div>
      <div>
        <span class="label">Target</span>
        <span>{{data.userDetail.targetAddress}}</span>
      </div>
      <div>
        <span class="label">Lync Account Status</span>
        <span>{{data.userDetail.msRtcsipEnabled | toYesNo}}</span>
      </div>
      <div v-if="data.userDetail.msRtcsipEnabled">
        <span class="label">Lync Account Status</span>
        <span>{{data.userDetail.msRtcsipPrimaryUserAddress}}</span>
      </div>
      <div>
        <span class="label">Department</span>
        <span>{{data.userDetail.department}}</span>
      </div>
    </div>
    <div class="account-details mt-4" v-if="data.userDetail">
      <h3 class="text-secondary">AD Account Status</h3>
      <div>
        <span class="label">Created</span>
        <span>{{data.userDetail.whenCreated | formatDateTime}}</span>
      </div>
      <div>
        <span class="label">Account Status</span>
        <span>{{data.userDetail.accountEnabled | toEnabledDisabled}}</span>
      </div>
      <div>
        <span class="label">Last Logon</span>
        <span>{{data.userDetail.lastLogonTimestamp | formatDateTime}}</span>
      </div>
      <div>
        <span class="label">Lockout Time</span>
        <span v-if="data.userDetail.lockoutTime == 0">Enabled</span>
        <span v-else>{{data.userDetail.lockoutTime | formatDateTime}}</span>
      </div>
      <div class="recent-locks">
        <span class="label">Recent Lockouts</span>
        <div v-if="data.splunkLockouts.totalRecords == 0">No Recent Lockouts</div>
        <div v-else>
          <div>Total Lockouts (Past 90 Days): {{data.splunkLockouts.totalRecords | formatNumber}}</div>
          <div class="splunk-log">
            <div
              class="splunk-log-entries"
              v-for="(item, index) in data.splunkLockouts.entities"
              :key="index"
            >
              <div>{{item.time | formatDateTime}}</div>
              <div>{{item.computer}}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span class="label">Account Expires</span>
        <span
          v-if="!isEmpty(data.userDetail.accountExpiresDate)"
        >{{data.userDetail.accountExpiresDate | formatDateTime}}</span>
        <span v-else>Never</span>
      </div>
      <div>
        <span class="label">Password Status</span>
        <span v-if="data.userDetail.pwdSet">Password Set</span>
        <span v-else>Password Not Set</span>
      </div>
      <div v-if="data.userDetail.pwdSet">
        <span class="label">Password Set Date</span>
        <span>{{data.userDetail.pwdLastSet | formatDateTime}}</span>
      </div>
      <div v-if="data.userDetail.pwdSet">
        <span class="label">Password Expires</span>
        <span v-if="!isEmpty(data.userDetail.pwdExpires)">{{data.userDetail.pwdExpires | formatDateTime}}</span>
        <span v-else></span>
      </div>
      <div v-if="!isEmpty(data.userDetail.badPasswordTime)">
        <span class="label">Bad Password Time</span>
        <span>{{data.userDetail.badPasswordTime | formatDateTime}}</span>
      </div>
      <div>
        <span class="label">UAC Flag</span>
        <span>{{data.userAccountControl}}</span>
      </div>
      
    </div>
  </div>
</template>
<script src="./active-directory-info.js"></script>
<style lang="scss" src="./active-directory-info.scss" scoped></style>
