<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">view_agenda</i>
        </div>
        <h1>List Deletions</h1>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label for="listName">List Name</label>
          <input
            type="text"
            class="form-control"
            id="listName"
            placeholder="Enter partial list name to retrieve lists containing entered value"
            v-select-all
            v-model="listName"
            v-on:keyup.13="search()"
          />
        </div>
        <div class="submit text-right mb-3">
          <button class="btn btn-primary mr-1" @click="search()">Search</button>
          <button class="btn btn-secondary" @click="reset()">Clear</button>
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
          <div role="table">
            <div class="row bg-primary text-white row-header list-deletions-header" role="rowheader">
              <div class="col col-name" role="columnheader" >
                
                 <a href="#" @click.prevent="sort('listName')" >List Name</a>
              </div>
              <div class="col col-date" role="columnheader" >
                <a href="#" @click.prevent="sort('createDate')" >Create Date</a>
                
              </div>
              <div class="col col-date" role="columnheader" >
                <a href="#" @click.prevent="sort('deleteDate')" >Delete Date</a>
                
              </div>
              <div class="col col-date" role="columnheader" >
                <a href="#" @click.prevent="sort('lastLogged')" >Last Logged</a>
                
              </div>
              <div class="col col-number" role="columnheader" >
                <a href="#" @click.prevent="sort('subscriberCount')" >Subscribers</a>
                
              </div>
            </div>
            <!-- Header Cols -->

            <!-- Record Results -->

            <div
              class="result-grid row list-deletions-rows"
              v-for="item in deletionList.entities"
              v-bind:key="item.listName"
              role="row"
            >
              <div class="col col-name" role="cell">{{item.listName}}</div>
              <div class="col col-date" role="cell">{{item.createDate | formatDate}}</div>
              <div class="col col-date" role="cell">{{item.deleteDate | formatDate}}</div>
              <div class="col col-date" role="cell">{{item.lastLogged | formatDate}}</div>
              <div class="col col-number" role="cell">
                <span>{{item.subscriberCount | formatNumber}}</span>
                <a href="#" @click.prevent="toggleSubscribers(item)" :aria-label="item.expanded ? 'Clapse Section to hide subscriber data' : 'Expand Section to reveal subscriber data'">
                  <i
                    class="fa fa-angle-double-down more-info"
                    :class="{expanded: item.expanded, collapsed: item.expanded === false}"
                  ></i>
                  <span v-if="item.expanded">collapse</span>
                  <span v-else>expand</span>
                </a>
              </div>

              <div class="subscriber-dump">
                <transition name="expand">
                  <div class="subscriber-dump-data" v-if="item.expanded">
                    <div class v-if="item.subscriberLoading">
                      <p>Subscriber data loading...</p>
                    </div>
                    <div v-else>
                      <div v-if="item.subscriberDump">
                        <div class="container" role="table">
                          <div
                            class="row bg-secondary text-white row-header border border-secondary" role="rowheader"
                          >
                            <div class="col" role="columnheader" aria-sort="none">Subscriber E-mail</div>
                            <div class="col" role="columnheader" aria-sort="none">Full Name</div>
                            <div class="col" role="columnheader" aria-sort="none">List Admin</div>
                            <div class="col col-last" role="columnheader" aria-sort="none">
                              <span>Modified Date</span>
                              <span>
                                <a
                                  class="text-white"
                                  title="download csv"
                                  href="#"
                                  @click.prevent="downloadCsv(item)"
                                  aria-label="Download CSV file"
                                >
                                  <i class="fas fa-file-csv" aria-hidden="true"></i>
                                </a>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div class="container result-grid sdd-grid border border-secondary" role="rowgroup">
                          <div
                            class="row"
                            v-for="dumpItem in item.subscriberDump"
                            :key="dumpItem.subscriberEmail"
                            role="row"

                          >
                            <div class="col" role="cell">{{dumpItem.subscriberEmail}}</div>
                            <div class="col" role="cell">{{dumpItem.subscriberFullName}}</div>
                            <div class="col" role="cell">{{dumpItem.isListAdmin}}</div>
                            <div class="col" role="cell">{{dumpItem.modifiedDate | formatDate}}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
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
