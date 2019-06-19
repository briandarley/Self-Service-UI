<template>
  <div class="audit-view pb-100"  v-if="data">
    <div class="account-details">
      <h4 class="text-secondary">
        General Info
      </h4>
      <div>
        <span class="label">Department Number(s)</span>
        <span>{{data.departmentNumber}}</span>
      </div>

      <div>
        <span class="label">Employee Type</span>
        <span>{{data.employeeType}}</span>
      </div>

      <div>
        <span class="label">User Account Control</span>
        <span>{{data.userAccountControl}}</span>
      </div>

      <div>
        <span class="label">Mail</span>
        <span>{{data.mail }}</span>
      </div>
      <div>
        <span class="label">UNC Email</span>
        <span v-if="data.uncEmail">{{data.uncEmail}}</span>
        <span v-else>None</span>
      </div>
    </div>

    <div class="yes-no-fields">
      <h4 class="text-secondary">AD</h4>
      <div>
        <span class="label">Is Ad Account Enabled</span>
        <span>{{data.isAdAccountEnabled | toYesNo}}</span>
      </div>

      <div>
        <span class="label">Is Public</span>
        <span>{{data.isPublic | toYesNo}}</span>
      </div>

      <div>
        <span class="label">Password Set</span>
        <span>{{data.pwdSet | toYesNo }}</span>
      </div>
    </div>
    <div class="account-details">
      <div>
        <span class="label">Password Last Set</span>
        <span>{{data.pwdLastSet | formatDate }}</span>
      </div>
    </div>
    <div class="yes-no-fields">
      <h4 class="text-secondary">Affiliations</h4>
      <div>
        <span class="label">GA Affiliated</span>
        <span>{{data.gaAffiliated | toYesNo }}</span>
      </div>
      <div>
        <span class="label">Is Affiliated</span>
        <span>{{data.isAffiliated | toYesNo}}</span>
      </div>
      <div>
        <span class="label">Is Emeritus</span>
        <span>{{data.isEmeritus | toYesNo}}</span>
      </div>
      <div>
        <span class="label">Is Employee</span>
        <span>{{data.isEmployee | toYesNo}}</span>
      </div>
      <div>
        <span class="label">Is Ga Scoped Affiliated</span>
        <span>{{data.isGaScopedAffiliated | toYesNo}}</span>
      </div>
      <div>
        <span class="label">Is Retiree</span>
        <span>{{data.isRetiree | toYesNo}}</span>
      </div>
      <div>
        <span class="label">Is Student</span>
        <span>{{data.isStudent | toYesNo}}</span>
      </div>
      <div>
        <span class="label">Retiree, Student or Emeritus only</span>
        <span>{{data.isRetireeStudentEmeritusOnly | toYesNo}}</span>
      </div>
    </div>
    <div class="account-details">
      <div>
        <span class="label">UNC Affiliation</span>
        <span>{{data.uncAffiliation}}</span>
      </div>
      <div>
        <span class="label">EduPersonScopedAffiliation</span>
        <span v-if="data.eduPersonScopedAffiliation">{{data.eduPersonScopedAffiliation}}</span>
        <span v-else>None</span>
      </div>
      <div>
        <span class="label">UNC Student Record Department Number</span>
        <span v-if="data.uncStudentRecordDepartmentNumber">{{data.uncStudentRecordDepartmentNumber}}</span>
        <span v-else>None</span>
      </div>
    </div>

    <div class="yes-no-fields">
      <h4 class="text-secondary">Hipaa</h4>
      <div>
        <span class="label">Hipaa Flagged Dept</span>
        <span>{{data.hipaaFlaggedDept | toYesNo}}</span>
      </div>
      <div>
        <span class="label">Hipaa Flagged User</span>
        <span>{{data.hipaaFlaggedUser | toYesNo}}</span>
      </div>
      <div>
        <span class="label">Is Hipaa Unc Plan</span>
        <span>{{data.isHipaaUncPlan | toYesNo}}</span>
      </div>
      <div>
        <span class="label">Is Hipaa Unc Plan Code</span>
        <span>{{data.isHipaaUncPlanCode | toYesNo}}</span>
      </div>
      <div>
        <span class="label">Worked for a Hipaa Dept</span>
        <span>{{data.workedForHipaaDept | toYesNo}}</span>
      </div>
    </div>
  </div>
</template>
<script src="./audit-info.js"></script>
<style lang="scss" src="./audit-info.scss" scoped></style>
