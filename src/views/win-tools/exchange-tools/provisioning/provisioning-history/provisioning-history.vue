<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">email</i>
        </div>
        <h1>Provisioning History</h1>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-info-circle"></i>
          </div>
          <div>
            <p>This tool shows listings of all provisioned mail accounts at the University.</p>
            <p>This tool also will show provisioned records that may have failed upon the initial provisioning request.</p>
            <p>Use this tool to view the history of provisioned records as well as re-provision accounts.</p>
            
          </div>
        </div>

        <search-criteria @search="search" @clear="clear" :criteria="criteria"></search-criteria>
        <div class="d-flex mt-5" style="justify-content:space-between" >
          <h3 class="text-primary">Total Records {{pagedResponse.totalRecords | formatNumber}}</h3>
          <pager
            :criteria="criteria"
            btn-count="5"
            :total-records="pagedResponse.totalRecords"
            v-on:indexChanged="indexChanged"
          ></pager>
        </div>

        <div class="search-result" role="table">
          <div class="bg-primary text-white row-header" role="rowheader">
            <div role="columnheader">
              <a href="#" @click.prevent="sort('id')" >Id</a>
            </div>
            <div role="columnheader">
              <a href="#" @click.prevent="sort('onyen')">Onyen</a>
            </div>

            <div role="columnheader">
              <a href="#" @click.prevent="sort('createdDate')">Created</a>
            </div>
            <div role="columnheader">
              <a href="#" @click.prevent="sort('status')">Status</a>
            </div>
            <div role="columnheader">
              <a href="#" @click.prevent="sort('statusDetail')">Detail</a>
            </div>
            <div role="columnheader">
              <a href="#" @click.prevent="sort('submittedBy')">Submitted By</a>
            </div>

            <div class="control"  role="columnheader">Action</div>
          </div>
          <div class="results" role="rowgroup">
            <div class="result-grid" v-for="item in pagedResponse.entities" :key="item.id" role="row">
              <div class="provision-detail">
                <div role="cell">{{item.id}}</div>
                <div role="cell">{{item.onyen}}</div>
                <div role="cell">{{item.createdDate | formatDate}}</div>
                <div role="cell">{{item.status}}</div>
                <div role="cell">{{item.statusDetail}}</div>
                <div role="cell">{{item.submittedBy}}</div>
 
                <div role="cell">
                  <a
                    href="#"
                    
                    :aria-label="'Reprovision account ' + item.onyen"
                    @click.prevent="confimReprovisionAccount(item)"
                  >Re-Provision</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <confirm-dialog id="confirmAction" ref="confirmAction" width="800">
      <div slot="modal-title" class="text-white">Confirm Re-Provision : Onyen {{entity.onyen}}</div>
      <div slot="modal-body">
        <p>Would you like to reprovision mailbox for account {{entity.onyen}} at this time?</p>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="reprovisionAccount()">Confirm</button>
        <button class="btn btn-secondary" @click="closeConfirmAction()">Close</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./provisioning-history.js"></script>
<style lang="scss" src="./provisioning-history.scss" scoped></style>
