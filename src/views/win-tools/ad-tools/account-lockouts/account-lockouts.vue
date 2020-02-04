<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fas fa-user-lock" aria-hidden="true"></i>
        </div>
        <h1>Account Lockouts</h1>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>
                The accounts listed have been identified by AD as being locked. A Window's Event was triggered and this event was submitted to Splunk.
                We attempt to retrieve the machine name whenever possible but there are times when this value is not available.
              </p>
              <p>Use the search field below to locate a desired record using Onyen</p>
            </div>
          </div>

          <div class="form-group">
            <label for="filterText">Search</label>
            <input
              type="text"
              class="form-control"
              v-select-all
              id="filterText"
              placeholder="onyen"
              v-model="criteria.filterText"
              v-on:keyup.13="search()"
            />
          </div>
          <div class="submit text-right" :class="{'mb-4': !pagedRecords.totalRecords}">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
          <div v-if="pagedRecords.totalRecords">
            <div class="container mt-5 mb-4">
              <div class="d-flex" style="justify-content:space-between">
                <h3 class="text-primary">Total {{pagedRecords.totalRecords | formatNumber}}</h3>
                <pager
                  :criteria="criteria"
                  btn-count="5"
                  :total-records="pagedRecords.totalRecords"
                  v-on:indexChanged="indexChanged"
                ></pager>
              </div>
              <div role="table">
              <!-- Header Cols -->
              <div class="bg-primary text-white row-header" role="rowheader">
                <div class="col" role="columnheader">
                  <span>Account</span>
                </div>
                <div class="col" role="columnheader">
                  <span>Machine</span>
                </div>
                <div class="col" role="columnheader">
                  <span>Time</span>
                </div>
              </div>
              <!-- Header Cols -->

              <!-- Record Results -->
              <div class="list-container" role="rowgroup">
                <div
                  class="result-grid"
                  v-for="(item, index) in pagedRecords.entities"
                  v-bind:key="index"
                  
                >
                  <div role="row">
                    <div role="cell" class="col">{{item.uid}}</div>
                    <div role="cell" class="col">{{item.computer}}</div>
                    <div role="cell" class="col">{{item.submittedDate | formatDateTime}}</div>
                  </div>
                </div>
              </div>
              <!-- Record Results -->
              </div>
            </div>

            <pager
              :criteria="criteria"
              btn-count="5"
              :total-records="pagedRecords.totalRecords"
              v-on:indexChanged="indexChanged"
            ></pager>
          </div>
          <div v-if="!pagedRecords.totalRecords && performedSearch">
            <div class="alert alert-warning">
              <div class="info">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
              </div>
              <p class="my-4 pb-3">The search results returned no records.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./account-lockouts.js"></script>
<style lang="scss" src="./account-lockouts.scss" scoped></style>
