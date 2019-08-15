<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-digital-tachograph"></i>
        </div>
        <h3>Provision Status</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle"></i>
            </div>
            <div>
              <p>This tool may be used to identify the latest provisioning status for users. Use the search criteria to filter by name, date range, and or provisioning status.</p>
            </div>
          </div>
          <div class="border border-primary">
            <div class="bg bg-primary text-white p-2">Search Criteria</div>
            <div class="m-2">
              <div class="">
                <div class="form-group form-inline d-flex">
                  <label for="txtOnyen">Onyen</label>
                  <input
                    id="txtOnyen"
                    type="text"
                    class="form-control flex-grow-1"
                    placeholder="Onyen"
                    v-model="criteria.onyen"
                  />
                </div>
                <div></div>
              </div>

              <div class="d-flex justify-content-around">
                <div class="form-group form-inline">
                  <label for>Date From</label>
                  <date-picker :selected-date.sync="criteria.submittedFromDate"></date-picker>
                </div>
                <div class="form-group form-inline">
                  <label for>Date To</label>
                  <date-picker :selected-date.sync="criteria.submittedThruDate"></date-picker>
                </div>
              </div>

              <div class="form-group">
                <label for>Limit Result</label>

                <ul class="radio-buttons mx-5 mt-2 mb-4">
                  <li>
                    <input
                      type="radio"
                      id="provision-selection-all"
                      value="0"
                      name="provision-selection"
                      v-model="provisionSelection"
                    />
                    <label for="provision-selection-all">All</label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="provision-selection-unprovisioned"
                      value="1"
                      name="provision-selection"
                      v-model="provisionSelection"
                    />
                    <label for="provision-selection-unprovisioned">Unprovisioned</label>
                  </li>
                </ul>
              </div>
              <div class="sumbit text-right">
                <button class="btn btn-primary mr-1" @click="search()">Search</button>
                <button class="btn btn-secondary" @click="clearCriteria()">Clear</button>
              </div>
            </div>
          </div>

          <div class="d-flex mt-3" style="justify-content:space-between">
            <h3 class="text-primary">Total Records {{provisionRecords.totalRecords | formatNumber}}</h3>
            <pager
              :criteria="criteria"
              btn-count="5"
              :total-records="provisionRecords.totalRecords"
              v-on:indexChanged="indexChanged"
            ></pager>
          </div>

          <div class="container border border-primary mt-1">
            <div class="row bg-primary text-white row-header">
              <div class="col">Onyen</div>
              <div class="col">Status</div>
              <div class="col">Submit Dt</div>
              <div class="col">Create Dt</div>
              <div class="col">Requestor</div>
              <div class="col"></div>
            </div>
            <div
              class="result-grid row"
              v-for="item in provisionRecords.entities"
              v-bind:key="item.listName"
            >
              <div class="col">{{item.onyen}}</div>
              <div class="col">{{item.status}}</div>
              <div class="col">{{item.submittedDate | formatDate}}</div>
              <div class="col">{{item.createdDate | formatDate}}</div>
              <div class="col">{{item.submittedBy}}</div>
              <div class="col"></div>
            </div>
          </div>

          <div class="mt-3">
            <pager
              :criteria="criteria"
              btn-count="5"
              :total-records="provisionRecords.totalRecords"
              v-on:indexChanged="indexChanged"
            ></pager>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./provision-status.js"></script>
<style lang="scss" src="./provision-status.scss" scoped></style>
