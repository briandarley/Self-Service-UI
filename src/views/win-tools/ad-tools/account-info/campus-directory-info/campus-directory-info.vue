<template>
  <div class="pb-100" v-if="data">
    <div class="account-details">
      <h4 class="text-secondary">General Information</h4>
      <div>
        <span class="label">Name</span>
        <span>{{data.name}}</span>
      </div>
      <div>
        <span class="label">PID</span>
        <span>{{data.pid}}</span>
      </div>
      <div>
        <span class="label">affiliation</span>
        <div class="list-items">
          <div v-for="(item, index) in data.affiliations" :key="index">{{item}}</div>
        </div>
      </div>
      <div>
        <span class="label">
          Home Phone
          <span class="text-danger" v-if="data.homePhone && !data.homePhonePublic">* (Private)</span>
        </span>
        <span v-if="data.homePhone">{{data.homePhone}}</span>
        <span v-else>Not Available</span>
      </div>
      <div>
        <span class="label">
          Home Address
        </span>
        <div v-if="data.homeAddress" class="list-items">
          <div v-html="homeAddress"></div>
        </div>
        <span v-else>Not Available</span>
        <span
            class="text-danger"
            v-if="data.homeAddress && !data.homeAddressPublic"
          >* (Private)</span>
      </div>
      <div>
        <span class="label">Email</span>
        <div class="list-items" v-if="data.email.length">
          <div v-for="(item, index) in data.email" :key="index">{{item}}</div>
        </div>
        <span v-else>Not Available</span>
      </div>
      <div>
        <span class="label">Groups</span>
        <div class="list-items" v-if="data.groups.length">
          <div v-for="(item, index) in data.groups" :key="index">{{item}}</div>
        </div>
        <span v-else>Not Available</span>
      </div>
      <div>
        <span class="label">Department Numbers</span>
        <div class="list-items" v-if="data.departmentNumbers.length">
          <div v-for="(item, index) in data.departmentNumbers" :key="index">{{item}}</div>
        </div>
        <span v-else>Not Available</span>
      </div>

      
    </div>
<div class="account-details mt-4">
  <h4 class="text-secondary">Academic Information</h4>
<div>
        <span class="label">Academic Group</span>
        <span v-if="data.academicGroup">{{data.academicGroup}}</span>
        <span v-else>Not Available</span>
      </div>
      <div>
        <span class="label">Academic Level</span>
        <span v-if="data.academicLevel">{{data.academicLevel}}</span>
        <span v-else>Not Available</span>
      </div>
</div>
<div class="account-details mt-4">
  <h4 class="text-secondary">Faculty/Staff Information</h4>
<div>
        <span class="label">Employee Type</span>
        <div class="list-items" v-if="data.employeeType.length">
          <div v-for="(item, index) in data.employeeType" :key="index">{{item}}</div>
        </div>
        <span v-else>Not Available</span>
     </div>
      <div>
        <span class="label">Title</span>
        <span>{{data.title}}</span>
      </div>
</div>

    
  </div>
</template>
<script src="./campus-directory-info.js"></script>
<style lang="scss" src="./campus-directory-info.scss" scoped></style>
