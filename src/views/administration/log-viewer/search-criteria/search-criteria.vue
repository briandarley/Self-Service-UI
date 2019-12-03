<template>
 <div class="border border-primary search-criteria">
    <div class="bg bg-primary text-white p-2">Search Criteria</div>
    <div class="m-2">
      <div class="row-1">
        <div class="application-filter">
          <div class="form-group">
            <label for="application-selection">Application</label>
            <select
              name="application-selection"
              id="application-selection"
              class="form-control"
              v-model="criteria.application"
            >
              <option value="ACTIVE_DIRECTORY_API">Active Directory</option>
              <option value="SELF_SERVICE_BUSINESS">Self Service</option>
              <option value="">All</option>
            </select>
          </div>
        </div>

        <div class="expirary-criteria">
          <div class="form-group">
            <div>
              <label for="dtExpDtFrom">Create Date From</label>
              <date-picker
                :selected-date.sync="criteria.createDateFrom"
                ref="dtExpDtFrom"
                id="dtExpDtFrom"
              ></date-picker>
            </div>
          </div>
          <div class="form-group">
            <label for="dtExpDtThru">Create Date Thru</label>

            <date-picker
              :selected-date.sync="criteria.createDateThru"
              ref="dtExpDtThru"
              id="dtExpDtThru"
            ></date-picker>
          </div>
        </div>
      </div>
      <div class="row-2">
        <div class="level-criteria">
          <div class="form-group">
            <label for="selectLevel">Level</label>
            <select
              name="selectLevel"
              id="selectLevel"
              class="form-control"
              v-model="criteria.level"
            >
              <option value="">All</option>
              <option value="ERROR">Error</option>
              <option value="WARNING">Warning</option>
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
              placeholder="Application, Message Content, Level, Auth User"
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
