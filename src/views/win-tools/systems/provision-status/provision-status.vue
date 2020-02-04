<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fas fa-digital-tachograph" aria-hidden="true"></i>
        </div>
        <h1>Provision Status</h1>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fa fa-info-circle" aria-hidden="true"></i>
            </div>
            <div>
              <p>This tool may be used to identify the latest provisioning status for users. Use the search criteria to filter by name, date range, and or provisioning status.</p>
            </div>
          </div>
          <div class="border border-primary">
            <div class="bg bg-primary text-white p-2">Search Criteria</div>
            <div class="m-2">
              <div class>
                <div class="form-group form-inline d-flex">
                  <label for="txtOnyen" >Onyen</label>
                  <input
                    id="txtOnyen"
                    type="text"
                    class="form-control flex-grow-1"
                    placeholder="Onyen"
                    aria-label="Onion"
                    v-model="criteria.onyen"
                  />
                </div>
                <div></div>
              </div>

              <div class="d-flex justify-content-around">
                <div class="form-group form-inline">
                  <label for="submittedFromDate">Date From</label>
                  <date-picker
                    :selected-date.sync="criteria.submittedFromDate"
                    id="submittedFromDate"
                  ></date-picker>
                </div>
                <div class="form-group form-inline">
                  <label for="submittedThruDate">Date To</label>
                  <date-picker
                    :selected-date.sync="criteria.submittedThruDate"
                    id="submittedThruDate"
                  ></date-picker>
                </div>
              </div>

              <div class="limit-filter">
                <label for="provision-selection-all">Limit Result</label>
                <div class="radio-buttons mx-5 mt-2 mb-4">
                  <div class="form-group">
                    <input
                      type="radio"
                      id="provision-selection-all"
                      value="0"
                      name="provision-selection"
                      v-model="provisionSelection"
                    />
                    <label for="provision-selection-all">All</label>
                  </div>
                  <div class="form-group">
                    <input
                      type="radio"
                      id="provision-selection-unprovisioned"
                      value="1"
                      name="provision-selection"
                      v-model="provisionSelection"
                    />
                    <label for="provision-selection-unprovisioned">Unprovisioned</label>
                  </div>
                </div>
                
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

          <div class="container border border-primary mt-1" role="table">
            <div class="row bg-primary text-white row-header" role="rowheader">
              <div class="col" role="columnheader" aria-label="Onion">Onyen</div>
              <div class="col" role="columnheader" aria-label="Status">Status</div>
              <div class="col" role="columnheader" aria-label="Submit Date">Submit Dt</div>
              <div class="col" role="columnheader" aria-label="Create Date">Create Dt</div>
              <div class="col" role="columnheader" aria-label="Requestor">Requestor</div>
              <div class="col" role="columnheader"></div>
            </div>
            <div
              class="result-grid row"
              v-for="item in provisionRecords.entities"
              v-bind:key="item.listName"
              role="row"
            >
              <div class="col" role="cell">{{item.onyen}}</div>
              <div class="col" role="cell">{{item.status}}</div>
              <div class="col" role="cell">{{item.submittedDate | formatDate}}</div>
              <div class="col" role="cell">{{item.createdDate | formatDate}}</div>
              <div class="col" role="cell">{{item.submittedBy}}</div>
              <div class="col" role="cell"></div>
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
