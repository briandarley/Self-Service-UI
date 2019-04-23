<template>
  <div class="container">
    <div class="alert alert-info">
      <div class="info">
        <i class="fa fa-info-circle"></i>
      </div>
      <p>The accounts listed in this section have been either marked for MFA expemption or have been scheduled for MFA exemption.</p>
      <p>Use the search field below to locate a desired record using Onyen, PID, Name, or Incident Number</p>
    </div>

    <div class="form-group">
      <label for>Search</label>
      <input
        type="text"
        class="form-control"
        v-select-all
        placeholder="onyen, pid, name, or incident number"
        v-model="criteria.filterText"
      >
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
        <div class="row bg-primary text-white row-header">
          <div class="col">
            <span>PID</span>
          </div>
          <div class="col">
            <span>Display Name</span>
          </div>
          <div class="col">
            <span>Exempt Begin</span>
          </div>
          <div class="col">
            <span>Exempt Expiry</span>
          </div>
          <div class="col"></div>
        </div>
        <!-- Header Cols -->

        <!-- Record Results -->

        <div
          class="result-grid row"
          v-for="(item, index) in pagedRecords.entities"
          v-bind:key="index"
        >
          <div>
            <div class="col">{{item.pid}}</div>
            <div class="col">{{item.displayName}}</div>
            <div class="col text-center">{{item.mfaExemptBeginDate | formatDate}}</div>
            <div class="col text-center">{{item.mfaExemptEndDate | formatDate}}</div>
            <div class="col check-buttons justify-content-center pt-2">
              <input type="checkbox" @click="enableMfa(item, $event)" :id="item.pid">
            </div>
          </div>
          <div class="reason pl-3">
            <div class="incident-change-user">
              <div>
                <label>Incident Number:</label>
                <span>{{item.incidentNumber}}</span>
              </div>
              <div>
                <label>Change User:</label>
                <span>{{item.changeUser}}</span>
              </div>
            </div>
            <div>
              <label>Reason:</label>
              <span>{{item.reason}}</span>
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
    <div v-else>
      <div class="alert alert-warning">
        <div class="info">
          <i class="fa fa-exclamation-circle"></i>
        </div>
        <p class="my-4 pb-3">
          The search results returned no records. 
        </p>
        
      </div>
    </div>

    <confirm-dialog id="confirmReEnableMfa" ref="confirmReEnableMfa">
      <div slot="modal-title">Enable MFA</div>
      <div slot="modal-body" v-if="this.selectedRecord">
        <div class="container">
          <div class="alert alert-info p-10">
            <div class="info">
              <i class="fa fa-exclamation-triangle"></i>
            </div>
            <p
              class="mt-3 mb-4"
            >Would you like to Enable MFA for {{this.selectedRecord.displayName}} at this time?</p>
          </div>

          <br>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="onEnableMfa()">yes</button>
        <button class="btn btn-secondary" @click="cancelEnableMfa()">cancel</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./mfa-disabled-accounts.js"></script>
<style lang="scss" src="./mfa-disabled-accounts.scss" scoped></style>
