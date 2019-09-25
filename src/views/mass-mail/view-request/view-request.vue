<template>
  <div class="container" id="view-request">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">search</i>
        </div>
        <h3>View Request</h3>
      </div>
      <div class="card-body">
        <div class="border border-primary">
          <div class="bg bg-primary text-white p-2">Search Criteria</div>
          <div class="m-2">
            <div class="form-group">
              <label for="campaign-status">Campaign Status</label>
              <select
                name="campaign-status"
                id="campaign-status"
                class="form-control"
                v-model="criteria.status"
              >
                <option value="PENDING">Pending Approval (All)</option>
                <option value="PENDING_STUDENTS">Pending Approval for Students</option>
                <option value="PENDING_EMPLOYEES">Pending Approval for Employees</option>
                <option value="EXPIRED">Expired</option>
                <option value="CANCELED">Canceled</option>
                <option value="DENIED">Denied</option>
                <option value="ALL">All</option>
              </select>
            </div>
            <div class="form-group">
              <label for="txt-filter">Filter</label>
              <input
                type="text"
                class="form-control"
                id="txt-filter"
                placeholder="Onyen, Subject, Campaign Id"
                v-select-all
                v-on:keyup.13="search()"
                v-model="criteria.filterText"
              />
            </div>

            <div class="sumbit text-right">
              <button class="btn btn-primary mr-1" @click="search()">Search</button>
              <button class="btn btn-secondary" @click="clearCriteria()">Clear</button>
            </div>
          </div>
        </div>

        <div class="d-flex mt-5" style="justify-content:space-between">
          <h3 class="text-primary">Total Campaigns {{pagedResponse.totalRecords | formatNumber}}</h3>
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
            <div>Id</div>
            <div>Author</div>
            <div>Send Date</div>
            <div>Population</div>
            <div>Priority</div>
            <div class="control">Action</div>
          </div>
          <div class="results">
            <div class="result-grid" v-for="item in pagedResponse.entities" :key="item.id">
              <div class="campaign-info">
                <div>{{item.id}}</div>
                <div>{{item.author}}</div>
                <div>{{item.sendDate | formatDate}}</div>
                <div>{{item.targetPopulation | formatSendingCriteria}}</div>
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
              <div class="campaign-status">
                <div v-html="approvalStatusText(item)"></div>
              </div>
              <div class="campaign-subject">{{item.subject}}</div>
              <div class="control-options">
                <button class="button btn btn-sm btn-primary" @click="viewReadOnlyView(item)">
                  <i class="material-icons">search</i>
                  <span>View</span>
                </button>
                <button class="button btn btn-sm btn-secondary" @click="toggleShowHistory(item)">
                  <i class="material-icons">history</i>
                  <span>History</span>
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
      <div slot="modal-title" class="text-white">View Read Only : Id {{readOnlyModel.id}}</div>
      <div slot="modal-body">
        <read-only-view :campaign="readOnlyModel"></read-only-view>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="closeConfirmViewReadOnly()">Close</button>
      </div>
    </confirm-dialog>

    <confirm-dialog id="confirmCampaignAction" ref="confirmCampaignAction" width="900">
      <div slot="modal-title" class="text-white">{{messageAction.title}}</div>
      <div slot="modal-body">
        <textarea
          name="campaignActionMessage"
          id="campaignActionMessage"
          class="form-control"
          rows="10"
          v-model="messageAction.message"
        ></textarea>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-primary" @click="doActionRequest()">Send Request</button>
        <button class="btn btn-secondary" @click="closeConfirmCampaignAction()">Cancel</button>
      </div>
    </confirm-dialog>
  </div>
</template>
<script src="./view-request.js"></script>
<style lang="scss" src="./view-request.scss" scoped></style>
