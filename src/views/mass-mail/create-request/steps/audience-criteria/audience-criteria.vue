<template>
  <form
    @submit.prevent.prevent
    class="container validation-form"
    autocomplete="off"
    ref="submitForm"
  >
    <div class="border border-primary">
      <div class="bg-primary text-white row-header">
        <div class="pl-3">Create Mass Mail - Audience Criteria</div>
      </div>
      <div class="m-3">
        <h2 class="text-primary">
          Audience Size:
          <span id="targetAudience"></span>
        </h2>
      </div>
      <!-- E-mail target population -->
      <div class="one-column">
        <div class="form-group">
          <div class="label-info">
            <label for="targetPopulation">E-mail Target Population</label>
            <span class="required">Required</span>
          </div>
          <div class="form-inline">
            <ul id="audience-selection">
              <li>
                <div class="check-buttons">
                  <input
                    type="checkbox"
                    name="all-checkbox"
                    id="all-checkbox"
                    v-model="audienceList[0].checked"
                    @click="toggleAll($event, 'all')"
                  />
                </div>
                <label for="All-checkbox">All</label>
              </li>
              <li>
                <div class="check-buttons">
                  <input
                    type="checkbox"
                    name="employee-checkbox"
                    id="employee-checkbox"
                   v-model="audienceList[1].checked"
                    @click="audienceChecked($event,'employee')"
                  />
                </div>
                <label for="employee-checkbox">Employees</label>
              </li>
              <li>
                <div class="check-buttons">
                  <input
                    type="checkbox"
                    name="student-checkbox"
                    id="student-checkbox"
                   v-model="audienceList[2].checked"
                    @click="audienceChecked($event, 'student')"
                  />
                </div>
                <label for="student-checkbox">Students</label>
              </li>
              <li>
                <div class="check-buttons">
                  <input
                    type="checkbox"
                    name="affiliate-checkbox"
                    id="affiliate-checkbox"
                   v-model="audienceList[3].checked"
                   
                    @click="audienceChecked($event, 'affiliate')"
                  />
                </div>
                <label for="student-checkbox">Affiliates</label>
              </li>
              <li>
                <div class="check-buttons">
                  <input
                    type="checkbox"
                    name="test-checkbox"
                    id="test-checkbox"
                    v-model="audienceList[4].checked"
                       
                     @click="clearAllAudiences($event, 'test')"              
                  />
                </div>
                <label for="test-checkbox">Test Only</label>
              </li>
            </ul>
          </div>
          <!-- <div class="form-inline">
            <select
              id="targetPopulation"
              class="form-control"
              v-model="model.targetPopulation"
              @change="targetPopulationChanged()"
              data-validation="{'name': 'Target Population','required': true}"
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
          </div> -->
        </div>
      </div>
      <!-- Employee Criteria -->
      <transition name="fade">
        <div class="one-column" v-if="showEmployeeCriteria">
          <div class="form-group">
            <div class="label-info">
              <label for="employeeCriteria">Employee Criteria</label>
              <span class="required">Required</span>
            </div>

            <div class="form-inline">
              <select
                id="employeeCriteria"
                class="form-control"
                v-model="model.targetEmployee"
                @change="employeeCriteriaChanged()"
                data-validation="{'name': 'Employee Criteria','required': true}"
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
      </transition>
      <!-- Check Audience -->
      <transition name="fade">
        <div class="check-audience" v-if="model.targetPopulation">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <p class="ml-3">
              Enter a user's onyen to verify if the person entered is found
              within the population criteria selected.
            </p>
          </div>

          <div class="one-column input-w-btn">
            <form
              @submit.prevent.prevent
              class="form-group"
              role="form"
              ref="checkAudienceForm"
            >
              <div class="label-info">
                <label for="checkAudience">Check Audience</label>
              </div>
              <div class="form-inline">
                <input
                  id="checkAudience"
                  type="text"
                  class="form-control"
                  placeholder="onyen"
                  v-model="onyen"
                  v-select-all
                />
                <button class="btn btn-primary" @click="checkUser()">
                  Check
                </button>
                <pop-over
                  title="Check Audience"
                  data-content="Use this to verify whether the person entered is a member of the selected audience."
                ></pop-over>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </div>

    <confirm-dialog id="confirmCheckUser" ref="confirmCheckUser" width="800">
      <div slot="modal-title" class="text-white">Check Audience Result</div>
      <div slot="modal-body">
        <div class="alert alert-warning">
          <div class="info">
            <i class="fa fa fa-exclamation-circle"></i>
          </div>
          <div>
            <p>{{ audienceCheckResult }}</p>
            <div>Validation Conflicts Occurred:</div>
            <ul>
              <li v-for="item in validationErrors" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closeConfirmCheckUser()">
          Close
        </button>
      </div>
    </confirm-dialog>
  </form>
</template>
<script src="./audience-criteria.js"></script>
<style lang="scss" src="./audience-criteria.scss"></style>
