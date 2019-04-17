<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">view_agenda</i>
        </div>
        <h3>List Deletions</h3>
      </div>
      <div class="card-body">
        <div class="form-group form-inline">
          <label for="listName">List Name</label>
          <input
            type="text"
            class="form-control"
            id="listName"
            placeholder="List Name"
            v-select-all
            v-model="listName"
          >
          <button class="btn btn-primary" @click="search()">Search</button>
          <button class="btn btn-secondary" @click="reset()">Reset</button>
        </div>
        <div
          v-if="deletionList && deletionList.entities && deletionList.entities.length"
          class="container list-deletions"
        >
          <div class="d-flex" style="justify-content:space-between">
            <h3 class="text-primary">Total Deletions {{deletionList.totalRecords | formatNumber}}</h3>
            <pager
              :criteria="criteria"
              btn-count="5"
              :total-records="deletionList.totalRecords"
              v-on:indexChanged="indexChanged"
            ></pager>
          </div>
          <!-- Header Cols -->
          <div class="row bg-primary text-white row-header list-deletions-header">
            <div class="col col-name">
              <span>List Name</span>
            </div>
            <div class="col col-date">
              <span>Create Date</span>
            </div>
            <div class="col col-date">
              <span>Delete Date</span>
            </div>
            <div class="col col-date">
              <span>Last Logged</span>
            </div>
            <div class="col col-number">
              <span>Subscribers</span>
            </div>
          </div>
          <!-- Header Cols -->

          <!-- Record Results -->

          <div
            class="result-grid row list-deletions-rows"
            v-for="item in deletionList.entities"
            v-bind:key="item.listName"
          >
            <div class="col col-name">{{item.listName}}</div>
            <div class="col col-date">{{item.createDate | formatDate}}</div>
            <div class="col col-date">{{item.deleteDate | formatDate}}</div>
            <div class="col col-date">{{item.lastLogged | formatDate}}</div>
            <div class="col col-number">
              <span>{{item.subscriberCount | formatNumber}}</span>
              <a href="#" @click.prevent="toggleSubscribers(item)">
                <i
                  class="fa fa-angle-double-down more-info"
                  :class="{expanded: item.expanded, collapsed: item.expanded === false}"
                ></i>
              </a>
            </div>

            <div class="subscriber-dump">
              <transition name="expand">
                <div class="subscriber-dump-data" v-if="item.expanded">
                  <div class="" v-if="item.subscriberLoading">
                    <p>Subsciber data loading...</p>
                  </div>
                  <div v-else>
                    <div v-if="item.subscriberDump">
                      <div class="container">
                        <div class="row bg-secondary text-white row-header border border-secondary">
                          <div class="col">Subscriber E-mail</div>
                          <div class="col">Full Name</div>
                          <div class="col">List Admin</div>
                          <div class="col col-last">
                            <span>Modified Date</span>
                            <span>
                              <a
                                class="text-white"
                                title="download csv"
                                href="#"
                                @click.prevent="downloadCsv(item)"
                              >
                                <i class="fas fa-file-csv"></i>
                              </a>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="container result-grid sdd-grid border border-secondary">
                        <div
                          class="row"
                          v-for="dumpItem in item.subscriberDump"
                          :key="dumpItem.subscriberEmail"
                        >
                          <div class="col">{{dumpItem.subscriberEmail}}</div>
                          <div class="col">{{dumpItem.subscriberFullName}}</div>
                          <div class="col">{{dumpItem.isListAdmin}}</div>
                          <div class="col">{{dumpItem.modifiedDate | formatDate}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Record Results -->
        </div>

        <pager
          :criteria="criteria"
          btn-count="5"
          :total-records="deletionList.totalRecords"
          v-on:indexChanged="indexChanged"
          class="mt-3"
        ></pager>
      </div>
    </div>
  </div>
</template>
<script src="./list-deletions.js"></script>
<style lang="scss" src="./list-deletions.scss" scoped></style>
