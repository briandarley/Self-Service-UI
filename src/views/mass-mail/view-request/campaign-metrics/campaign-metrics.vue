<template>
  <div class="container">
    <div v-if="!notFound">
      <h4 class="text-primary">Summary</h4>

      <div class="search-result" role="table">
        <!-- <div class="bg-primary text-white row-header" role="rowheader">
            <div role="columnheader"> -->

        <div
          class="result-grid bg-primary text-white row-header"
          role="rowheader"
        >
          <div class="col" role="columnheader">
            Total Unique Reads
          </div>
          <div class="col" role="columnheader">
            Total Reads
          </div>
          <div class="col" role="columnheader">
            First Read
          </div>
          <div class="col" role="columnheader">
            Last Read
          </div>
        </div>

        <div class="results" role="rowgroup">
          <div class="result-grid">
            <div class="col">
              {{ entity.totalUniqueReads | formatNumber }}
            </div>
            <div class="col">
              {{ entity.totalReads | formatNumber }}
            </div>
            <div class="col">
              {{ entity.initialReadTime | formatDateTime("M/D h:mm a") }}
            </div>
            <div class="col">
              {{ entity.lastReadTime | formatDateTime("M/D h:mm a") }}
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex mt-5" style="justify-content:space-between" v-if="false">
        <h3 class="text-primary">
          Total {{ userActivity.totalRecords | formatNumber }}
        </h3>
        <pager
          :criteria="userActivityCriteria"
          btn-count="5"
          :total-records="userActivity.totalRecords"
          v-on:indexChanged="indexChanged"
        ></pager>
      </div>
      <div class="search-result" role="table" id="user-activity" v-if="false">
        <div
          class="result-grid bg-primary text-white row-header"
          role="rowheader"
        >
          <div class="col" role="columnheader">
             <a href="#" @click.prevent="sort('countryName')">Country</a>
          </div>
          <div class="col" role="columnheader">
            <a href="#" @click.prevent="sort('regionName')">State</a>
          </div>
          <div class="col" role="columnheader">
            <a href="#" @click.prevent="sort('city')">City</a>
          </div>
          <div class="col" role="columnheader">
            <a href="#" @click.prevent="sort('totalReads')">Total Reads</a>
            
          </div>
        </div>
        <div class="result-grid filter bg-white row-header">
          <div class="col p-0 m-0">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="filter"
              autocomplete="off"
              v-select-all
              v-model="filter.country"
            />
          </div>
          <div class="col p-0">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="filter"
              autocomplete="off"
              v-select-all
              v-model="filter.region"
            />
          </div>
          <div class="col p-0">
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="filter"
              autocomplete="off"
              v-select-all
              v-model="filter.city"
            />
          </div>
          <div class="col p-0"></div>
          
        </div>
        <div class="results-container">
          <div
            class="results user-activity-results border border-secondary"
            role="rowgroup"
            v-if="!calculating"
          >
            <div class="sdd-grid">
              <div
                class="result-grid"
                v-for="(item, index) in userActivity.entities"
                v-bind:key="index"
                role="row"
              >
                <div class="col">
                  {{ item.countryName }}
                </div>
                <div class="col">
                  {{ item.regionName }}
                </div>
                <div class="col">
                  {{ item.city }}
                </div>
                <div class="col">
                  {{ item.totalReads | formatNumber }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="alert alert-danger">
        <div class="info">
          <i class="fas fa-exclamation-circle"></i>
        </div>

        <h4 class="my-4 p-2">Metrics Unavailable</h4>
      </div>
    </div>
  </div>
</template>
<script src="./campaign-metrics.js"></script>
<style lang="scss" src="./campaign-metrics.scss" scoped></style>
