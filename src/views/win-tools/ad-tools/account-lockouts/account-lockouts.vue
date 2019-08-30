<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fas fa-user-lock"></i>
        </div>
        <h3>Account Lockouts</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle"></i>
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
              <!-- Header Cols -->
              <div class="bg-primary text-white row-header">
                <div class="col">
                  <span>Account</span>
                </div>
                <div class="col">
                  <span>Machine</span>
                </div>
                <div class="col">
                  <span>Time</span>
                </div>
              </div>
              <!-- Header Cols -->

              <!-- Record Results -->
              <div class="list-container">
                <div
                  class="result-grid"
                  v-for="(item, index) in pagedRecords.entities"
                  v-bind:key="index"
                >
                  <div>
                    <div class="col">{{item.uid}}</div>
                    <div class="col">{{item.computer}}</div>
                    <div class="col">{{item.submittedDate | formatDateTime}}</div>
                  </div>
                </div>
              </div>
              <!-- Record Results -->
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
                <i class="fa fa-exclamation-circle"></i>
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
