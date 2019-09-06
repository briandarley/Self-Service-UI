<template>
  <div class="form-group date-picker">
    <label :for="id" v-if="label">{{label}}</label>
    
    <div>
      <input
        :id="id"
        type="text"
        class="form-control"
        placeholder="mm/dd/yyyy"
        v-select-all
        v-model="value"
        
      />
      <span class="input-group-addon btn btn-outline-primary calendar-icon" @click="showCalendar()">
        <i class="fa fa-calendar" aria-hidden="true"></i>
      </span>
    </div>
  </div>
</template>
<script src="./date-picker.js"></script>
<style lang="scss" src="./date-picker.scss" ></style>
