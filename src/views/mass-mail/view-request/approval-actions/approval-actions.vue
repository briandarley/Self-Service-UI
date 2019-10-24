<template>
  <div class="dropdown approval-actions" :id="elmId">
    <button
      type="button"
      class="btn btn-default"
      :class="{'disabled': !dropDownEnabled, 'dropdown-toggle': dropDownEnabled}"
      aria-haspopup="true"
      aria-expanded="false"
      data-toggle="dropdown"
      
    >Approval</button>
    
    <div class="main-dropdown dropdown-menu" role="menu">
      
      <a
        class="dropdown-item text-primary"
        @click.prevent="sendNow()"
        v-if="showSendNow"
      >
        <i class="material-icons">send</i>
        <span>Send Now</span>
      </a>

      <div class="employee-actions">
        <a
          role="button"
          class="dropdown-item dropdown-toggle text-primary"
          @click.prevent="showElement($event, 'employee-actions')"
          v-if="showEmployeeApproval"
        >
          <i class="fa fa-hard-hat"></i>
          <span>Employee Action</span>
        </a>
        <div class="dropdown-menu border-0 shadow" role="menu">
          <a class="dropdown-item text-primary" @click.prevent="approve('employee')">
            <i class="material-icons">thumb_up</i>
            <span>Approve</span>
          </a>
          <a class="dropdown-item text-danger" @click.prevent="deny('employee')">
            <i class="material-icons">thumb_down</i>
            <span>Deny</span>
          </a>
        </div>
      </div>

      <div class="student-actions">
        <a
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
          class="dropdown-item dropdown-toggle text-primary"
          @click.prevent="showElement($event, 'student-actions')"
          v-if="showStudentApproval"
        >
          <i class="fa fa-graduation-cap"></i>
          <span>Student Action</span>
        </a>
        <div class="dropdown-menu border-0 shadow" role="menu">
          <a class="dropdown-item text-primary" @click.prevent="approve('student')">
            <i class="material-icons">thumb_up</i>
            <span>Approve</span>
          </a>

          <a class="dropdown-item text-danger" @click.prevent="deny('student')">
            <i class="material-icons">thumb_down</i>
            <span>Deny</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./approval-actions.js"></script>
<style lang="scss" src="./approval-actions.scss" scoped></style>
