<template>
  <div class="container" id="view-request">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">search</i>
        </div>
        <h1>View Request</h1>
      </div>
      <div class="card-body">
        <search-criteria @search="search" @clear="clear" :criteria="criteria"></search-criteria>

        <div class="d-flex mt-5" style="justify-content:space-between">
          <h3 class="text-primary">Total Emails {{pagedResponse.totalRecords | formatNumber}}</h3>
          <pager
            :criteria="criteria"
            btn-count="5"
            :total-records="pagedResponse.totalRecords"
            v-on:indexChanged="indexChanged"
          ></pager>
        </div>

        <!--Trigger-->
        <div class="search-result">
          <div class="bg-primary text-white row-header">
            <div><a href="#" @click.prevent="sort('id')">ID</a></div>
            <div><a href="#" @click.prevent="sort('author')">Author</a></div>
            <div><a href="#" @click.prevent="sort('sendDate')">Send Date</a></div>
            <div><a href="#" @click.prevent="sort('expirationDate')">Exp Date</a></div>
            <div><a href="#" @click.prevent="sort('targetPopulation')">Population</a></div>
            <div><a href="#" @click.prevent="sort('priority')">Priority</a></div>
            <div class="control">Action</div>
          </div>
          <div class="results">
            <div class="result-grid" v-for="item in pagedResponse.entities" :key="item.id">
              
              <div class="campaign-info">
                <div>{{item.id}}</div>
                <div>{{item.author}}</div>
                <div>{{item.sendDate | formatDate}}</div>
                <div>{{item.expirationDate | formatDate}}</div>
                <div>{{item.targetPopulation | formatSendingCriteria(true)}}</div>
                <div>{{item.priority}}</div>
                <div>
                  <div>
                    <actionMenu :entity="item" @action="onAction"></actionMenu>
                  </div>
                  <div>
                    <approval-actions :entity="item" @action="onAction"></approval-actions>
                  </div>
                </div>
              </div>
              <div class="campaign-subject">{{item.subject}}</div>
              <div class="campaign-status">
                <div v-html="$options.filters.approvalStatusText(item)"></div>
              </div>
              <div class="progress hidden" :id="'progessbar_' + item.id">
                <div
                  class="progress-bar"
                  role="progressbar"
                  aria-valuenow="75"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              
              <div class="control-options">
                <button class="button btn btn-sm btn-primary" @click="viewReadOnlyView(item)">
                  <i class="material-icons">search</i>
                  <span>View</span>
                </button>
                <button class="button btn btn-sm btn-outline-light text-dark border-dark" @click="toggleShowHistory(item)">
                  <i class="material-icons">history</i>
                  <span>History</span>
                </button>
                <button class="button btn btn-sm btn-outline-light text-dark border-dark" @click="viewConfirmCampaignMetrics(item)" v-if="showVerify(item)">
                  <i class="material-icons">trending_up</i>
                  <span>Metrics</span>
                </button>
                <button class="button btn btn-sm btn-outline-light text-dark border-dark" @click="viewShowVerify(item)" v-if="showVerify(item)">
                  <i class="material-icons">verified_user</i>
                  <span>Verify</span>
                </button>
                
              </div>
              <transition name="fade">
                <view-history :campaignId="item.id" v-if="item.showHistory"></view-history>
              </transition>
            </div>
          </div>
        </div>

        <div class="d-flex mt-2" style="justify-content:space-between">
          <div></div>
          <pager
            :criteria="criteria"
            btn-count="5"
            :total-records="pagedResponse.totalRecords"
            v-on:indexChanged="indexChanged"
          ></pager>
        </div>
        
      </div>
    </div>

    <confirm-dialog id="confirmViewReadOnly" ref="confirmViewReadOnly" width="800">
      <div slot="modal-title" class="text-white">View Read Only : Campaign Id {{readOnlyModel.id}}</div>
      <div slot="modal-body">
        <read-only-view :campaign="readOnlyModel"></read-only-view>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closeConfirmViewReadOnly()">Close</button>
      </div>
    </confirm-dialog>
    <confirm-dialog id="confirmViewHistory" ref="confirmViewHistory" width="800">
      <div slot="modal-title" class="text-white">History : Campaign Id {{readOnlyModel.id}}</div>
      <div slot="modal-body">
        <view-history :campaignId="readOnlyModel.id"></view-history>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closeConfirmViewHistory()">Close</button>
      </div>
    </confirm-dialog>
    <confirm-dialog id="confirmVerify" ref="confirmVerify" width="800">
      <div slot="modal-title" class="text-white">Verify Receipt : Id {{readOnlyModel.id}}</div>
      <div slot="modal-body">
        <confirm-verify :campaign="readOnlyModel"></confirm-verify>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closeConfirmVerify()">Close</button>
      </div>
    </confirm-dialog>
    <confirm-dialog id="confirmCampaignMetrics" ref="confirmCampaignMetrics" width="800">
      <div slot="modal-title" class="text-white">Message Metrics : {{readOnlyModel.id}}</div>
      <div slot="modal-body">
        <campaign-metrics :campaignId="readOnlyModel.id"></campaign-metrics>
        
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closeConfirmCampaignMetrics()">Close</button>
      </div>
    </confirm-dialog>
    <campaign-communications
      ref="campaignCommunications"
      @cancel="onHideCommunication"
      @confirm="onConfirmCommunication"
    ></campaign-communications>
  </div>
</template>
<script src="./view-request.js"></script>
<style lang="scss" src="./view-request.scss" scoped></style>
