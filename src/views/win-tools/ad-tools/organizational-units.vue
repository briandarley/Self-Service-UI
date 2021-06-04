<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-cubes" aria-hidden="true"></i>
        </div>
        <h1>Organizational Units</h1>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="form-group">
            <label for="filter">Search</label>
            <input
              type="text"
              id="filter"
              class="form-control"
              v-select-all
              placeholder="name, domain, onyen, etc.. "
              v-model="filter"
              v-on:keyup.13="search()"
              autocomplete="off"
            />
          </div>
          <div class="submit text-right">
            <button class="btn btn-primary mr-1" @click="search()">
              Search
            </button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
          <div class="d-flex mt-5" style="justify-content:space-between ">
            <h3 class="text-primary">
              Total Entities {{ pagedResponse.totalRecords | formatNumber }}
            </h3>
            <pager
              :criteria="criteria"
              btn-count="5"
              :total-records="pagedResponse.totalRecords"
              v-on:indexChanged="indexChanged"
            ></pager>
          </div>
          <transition name="fade">
            <div class="results" v-if="pagedResponse" role="table">
              <div class="bg-primary text-white row-header" role="rowheader">
                <div role="columnheader" class="col">
                  <a href="#" @click.prevent="sort('name')">OU Name</a>
                </div>
                <div role="columnheader" class="col">
                  <a href="#" @click.prevent="sort('ou')">Ou</a>
                </div>
                <div role="columnheader" class="col">
                  <a href="#" @click.prevent="sort('department')">Department</a>
                </div>
              </div>
              <div class="result-grid list-container">
                <div
                  class="entity-info"
                  v-for="(item, index) in pagedResponse.entities"
                  :key="index"
                  role="rowgroup"
                >
                  <div class="row org-info" role="row">
                    
                    <div role="cell" class="col">{{ item.name }}</div>
                    <div role="cell" class="col">{{ item.ou }}</div>
                    <div role="cell" class="col">{{ item.department }}</div>
                    
                  </div>
                  <div
                    class="row contact-info"
                    role="row"
                    v-if="item.organizationalUnitAdmins.length > 0"
                  >
                    <div
                      v-for="(admin, subIndex) in item.organizationalUnitAdmins"
                      :key="subIndex"
                    >
                      <ul class="d-flex mx-3">
                        <li class="flex-sm-grow-1" style="width:20%">
                          <span class="d-inline strong">Name:</span>
                          <span>{{ admin.name }}</span>
                        </li>
                        <li class="flex-sm-grow-1" style="width:30%">
                          <span class="strong">E-Mail:</span>
                          <span>{{ admin.mail }}</span>
                        </li>
                        <li class="flex-sm-grow-1" v-if="admin.phone">
                          <span class="strong">Phone:</span>
                          <span>{{ admin.phone }}</span>
                        </li>
                      </ul>
                    </div>
                    
                  </div>
                  <div v-else>
                    <span class="mx-5">No Admin listed</span>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "organizational-units",
  dependencies: [
    "$",
    "moment",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "ScreenReaderAnnouncerService",
  ],
})
export default class OrganizationalUnits extends Vue {
  filter = "";
  sortCol = "name";
  dir = "asc";
  _currentCol = "name";
  pagedResponse = {};
  originalRecords = [];
  criteria = {
    index: 0,
    pageSize: 100,
    isRootOu: true,
    sort: "name",
  };
  async mounted() {
    this.toastService.set(this);
    await this.initializeRecords();
    this.ScreenReaderAnnouncerService.sendPageLoadAnnouncement(
      "Win Tools - Active Directory - Organizational Units"
    );
  }
  async search() {
   this.criteria.filterText = this.filter;
   await this.initializeRecords();
  }
  async clear() {
    this.filter = "";
    this.criteria.filterText = "";
    this.criteria.index = 0;

    await this.initializeRecords();
    
  }

  async initializeRecords() {
    this.spinnerService.show();
    try {
      let pagedResponse = await this.ExchangeToolsService.getOrganizationalUnits(
        this.criteria
      );

      this.pagedResponse = pagedResponse;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve records");
    } finally {
      this.spinnerService.hide();
    }
  }
  async indexChanged(index) {
    this.criteria.index = index;
    this.criteria = JSON.parse(JSON.stringify(this.criteria));
    await this.initializeRecords();
  }

  async sort(column) {
    if (this._currentCol === column) {
      this._currentSortDir *= -1;
    } else {
      this._currentSortDir = 1;
    }

    this._currentCol = column;

    this.criteria.index = 0;
    this.criteria.sort = this._currentCol;
    this.criteria.listSortDirection = this._currentSortDir == 1 ? 1 : 0;

    await this.initializeRecords();
  }
}
</script>
<style lang="scss" scoped>
.results {
  border: 1px solid $carolina-blue;
  margin-top: 20px;
}
.row {
  margin: auto;
}
.row-header {
  display: flex;
  .col {
    flex: 1;
  }
  .col:nth-of-type(4) {
    flex: 2;
  }
}

.contact-info {
  display: flex;
  flex-flow: column;
  span:first-of-type {
    display: inline-block;
    text-align: right;
    width: 150px;
    padding-right: 10px;
  }
  ul,
  ul li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
}
.entity-info {
  .col {
    flex: 1;
  }
  .col:nth-of-type(4) {
    flex: 2;
  }
}

.result-grid {
  line-height: 40px;

  &:nth-of-type(odd) {
    border: none;
  }
  &:nth-of-type(even) {
    background: $gray-100;
    border: none;
  }
}
.entity-info:nth-of-type(odd) {
  border: none;
}
.entity-info:nth-of-type(even) {
  background: $white;
  border: none;
  border-top: 2px solid $gray-200;
  border-bottom: 2px solid $gray-200;
}
</style>
