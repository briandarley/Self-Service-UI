<template>
  <div class="border border-primary search-criteria">
    <div class="bg bg-primary text-white p-2">Search Criteria</div>
    <div class="m-2">
      <div class="row-1">
        <div class="campaign-criteria">
          <div class="form-group">
            <label for="campaign-status">Campaign Status</label>
            <select
              name="campaign-status"
              id="campaign-status"
              class="form-control"
              v-model="criteria.status"
            >
              <option value="PENDING">Pending Approval (All)</option>
              <option value="PENDING_STUDENTS">Pending Approval for Students</option>
              <option value="PENDING_EMPLOYEES">Pending Approval for Employees</option>
              <option value="APPROVED">Approved</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELED">Canceled</option>
              <option value="DENIED">Denied</option>
              <option value="DONE">Done</option>
              <option value="ALL">All</option>
            </select>
          </div>
        </div>

        <div class="expirary-criteria">
          <div class="form-group">
            <div>
              <label for="dtExpDtFrom">Expire Date From</label>
              <date-picker
                :selected-date.sync="criteria.expireDateFrom"
                ref="dtExpDtFrom"
                id="dtExpDtFrom"
              ></date-picker>
            </div>
          </div>
          <div class="form-group">
            <label for="dtExpDtThru">Expire Date Thru</label>

            <date-picker
              :selected-date.sync="criteria.expireDateThru"
              ref="dtExpDtThru"
              id="dtExpDtThru"
            ></date-picker>
          </div>
        </div>
      </div>
      <div class="row-2">
        <div class="population-criteria">
          <div class="form-group">
            <label for="selectPopulation">Population</label>
            <select
              name="selectPopulation"
              id="selectPopulation"
              class="form-control"
              v-model="criteria.population"
            >
              <option value="ALL">All</option>
              <option value="EMPLOYEES">Employees</option>
              <option value="STUDENTS">Students</option>
            </select>
          </div>
        </div>
        <div class="priority-criteria">
          <div class="form-group">
            <label for="selectPriority">Priority</label>
            <select
              name="selectPriority"
              id="selectPriority"
              class="form-control"
              v-model="criteria.priority"
            >
              <option value="ALL">All</option>
              <option value="FORMAL NOTICE">Formal</option>
              <option value="INFORMATIONAL">Informal</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row-3">
        <div class="filter-criteria">
          <div class="form-group">
            <label for="txt-filter">Filter</label>
            <input
              type="text"
              class="form-control"
              id="txt-filter"
              placeholder="Onyen, Subject, Campaign Id"
              v-select-all
              v-on:keyup.13="search()"
              v-model="criteria.filterText"
              autocomplete="off"
            />
          </div>
        </div>
      </div>

      <div class="sumbit text-right">
        <button class="btn btn-primary mr-1" @click="search()">Search</button>
        <button class="btn btn-secondary" @click="clear()">Clear</button>
      </div>
    </div>
  </div>
</template>
<script src="./search-criteria.js"></script>
<style lang="scss" src="./search-criteria.scss" scoped></style>
