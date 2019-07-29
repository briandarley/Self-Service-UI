<template>
  <form @submit.prevent.prevent class="container validation-form" autocomplete="off">
  
    <div class="border border-primary">
      <div class="bg-primary text-white row-header">
        <div class="pl-3">Create Mass Mail - Audience Criteria</div>
      </div>
      <div class="m-3">
        <h4 class="text-primary">Audience Size: <span id="targetAudience"></span></h4>
        
      </div>
      <!-- E-mail target population -->
      <div class="one-column">
        <div class="form-field">
          <div class="form-group form-inline">
                     <label for="targetPopulation">E-mail Target Population</label>
                     <div class="standard-text">
          <select
            id="targetPopulation"
            class="form-control"
            v-model="model.targetPopulation"
            @change="calculateAudience"
            v-validate="{'name': 'Target Population', error: 'Target population is Required','required': true}"
          >
              <option value="">--Select Target Population --</option>
              <option value="EMPLOYEES_STUDENTS">Employees and Students</option>
              <option value="EMPLOYEES">Employees</option>
              <option value="STUDENTS">Students</option>
              <option value="TESTING_ONLY">Testing Only</option>
          </select>
          <pop-over
            title="E-mail Target Population"
            data-content="Select the appropriate target population."
          ></pop-over>
          </div>
          </div>
        </div>
      </div>
      <!-- Employee Criteria -->
      <div class="one-column">
        <div class="form-field">
          <div class="form-group form-inline">
                     <label for="employeeCriteria">Employee Criteria</label>
                     <div class="standard-text">
          <select
            id="employeeCriteria"
            class="form-control"
            v-model="model.employeeCriteria"
            v-validate="{'name': 'Employee Criteria', error: 'Employee Criteria is Required','required': true}"
          >
             <option value>--Select Employee Criteria--</option>
            <option>All Employees</option>
            <option>DDD</option>
          </select>
            <pop-over
            title="Employee Criteria"
            data-content="Select the appropriate employee criteria."
          ></pop-over>
          </div>
          </div>
        </div>
      </div>
      <!-- Check Audience -->
       <div class="one-column">
        <div class="form-field">
           <div class="form-group form-inline">
              <label for="checkAudience">Check Audience</label>
              <div class="">
                <input id="checkAudience" type="text" class="form-control" placeholder="onyen" v-model="onyen" v-select-all>
                <button class="btn btn-primary">Check</button>
                <pop-over
                  title="Check Audience"
                  data-content="Use this to verify whether the person entered is a member of the selected audience."
                ></pop-over>
                </div>
        </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script src="./audience-criteria.js"></script>
<style lang="scss" src="./audience-criteria.scss"></style>
