<template>
  <div class="border border-primary">
    <div class="bg bg-primary text-white p-2">Search Criteria</div>
    <div class="m-2">
      <div class="d-flex justify-content-between">
        <div class="form-group flex-grow-1 pr-3 mr-3">
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
            <option value="EXPIRED">Expired</option>
            <option value="CANCELED">Canceled</option>
            <option value="DENIED">Denied</option>
            <option value="ALL">All</option>
          </select>
        </div>
        <div class="d-flex flex-grow-0">
          <div class="form-group mr-3">
            <div>
              <label for="dtExpDtFrom">Expire Date From</label>
              <date-picker
                :selected-date.sync="criteria.expireDateFrom"
                ref="dtExpDtFrom"
                id="dtExpDtFrom"
              ></date-picker>
            </div>
          </div>
          <div class="form-group flex-fill">
            <label for="dtExpDtThru">Expire Date Thru</label>

            <date-picker
              :selected-date.sync="criteria.expireDateThru"
              ref="dtExpDtThru"
              id="dtExpDtThru"
            ></date-picker>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-between flex-grow-1">
        <div class="form-group flex-fill mr-3">
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

        <div class="form-group flex-fill ml-3">
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

      <div class="sumbit text-right">
        <button class="btn btn-primary mr-1" @click="search()">Search</button>
        <button class="btn btn-secondary" @click="clear()">Clear</button>
      </div>
    </div>
  </div>
</template>
<script src="./search-criteria.js"></script>
<style lang="scss" src="./search-criteria.scss" scoped></style>
