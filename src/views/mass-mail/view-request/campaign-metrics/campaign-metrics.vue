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

      <h4 class="text-primary mt-3">Top 10 Reads By Ip Address</h4>
      <div class="search-result" role="table" id="reads-by-ip">
        <div
          class="result-grid bg-primary text-white row-header"
          role="rowheader"
        >
          <div class="col" role="columnheader">
            IP Address
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
          <div
            class="result-grid"
            v-for="(item, index) in topIpList"
            v-bind:key="index"
            role="row"
          >
            <div class="col">
              {{ item.ipAddress }}
            </div>
            <div class="col">
              {{ item.totalReads | formatNumber }}
            </div>
            <div class="col">
              {{ item.initialReadTime | formatDateTime("M/D h:mm a") }}
            </div>
            <div class="col">
              {{ item.lastReadTime | formatDateTime("M/D h:mm a") }}
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
