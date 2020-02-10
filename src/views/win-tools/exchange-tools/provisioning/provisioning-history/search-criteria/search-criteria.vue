<template>
  <div class="border border-primary search-criteria">
    <div class="bg bg-primary text-white p-2">Search Criteria</div>
    <div class="m-2">
      <div class="row-1">
        <div class="campaign-criteria">
          <div class="form-group">
            <label for="provision-status">Provision Status</label>
            <select
              name="provision-status"
              id="provision-status"
              class="form-control"
              v-model="criteria.status"
              role="listbox"
            >
              <option value="">All</option>
              <option value="Processing" aria-label="Processing">Processing</option>
              <option value="Failed" aria-label="Failed">Failed</option>
              <option value="Completed" aria-label="Completed">Completed</option>
              
            </select>
          </div>
        </div>

        
      </div>
      
      <div class="row-2">
        <div class="filter-criteria">
          <div class="form-group">
            <label for="txt-filter" id="lblFilterTxt">Filter (Search previously provisioned records)</label>
            <input
              type="text"
              class="form-control"
              id="txt-filter"
              placeholder="Search previously provisioned accounts by user Onyen or provision ID"
              v-select-all
              v-on:keyup.13="search()"
              v-model="criteria.filterText"
              autocomplete="off"
              aria-labelledby="lblFilterTxt"
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
