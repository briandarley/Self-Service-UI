<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="fa fas fa-cubes"></i>
        </div>
        <h3>Organizational Units</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="form-group">
            <label for>Search</label>
            <input
              type="text"
              class="form-control"
              v-select-all
              placeholder="name, domain, onyen, etc.. "
              v-model="filter"
              v-on:keyup.13="search()"
            >
          </div>
          <div class="submit text-right">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>

          <transition name="fade">
            <div class="results" v-if="records">
              <div class="bg-primary text-white row-header">
                <div class="col">
                  <a href="#" @click.prevent="sort('name')">OU Name</a>
                </div>
                <div class="col">
                  <a href="#" @click.prevent="sort('domain')">Domain</a>
                </div>
                <div class="col">
                  <a href="#" @click.prevent="sort('onyen')">Onyen</a>
                </div>
                <div class="col">
                  <a href="#" @click.prevent="sort('department')">Department</a>
                </div>
              </div>
              <div class="result-grid list-container">
                <div class="entity-info" v-for="(item, index) in records" :key="index">
                  <div class="row org-info">
                    <div class="col">{{item.name}}</div>
                    <div class="col">{{item.domain}}</div>
                    <div class="col">{{item.onyen}}</div>
                    <div class="col">{{item.department}}</div>
                  </div>
                  <div class="row contact-info">
                    <ul>
                      <li>
                        <span class="strong">Name:</span>
                        <span>{{item.contactName}}</span>
                      </li>
                      <li>
                        <span class="strong">E-Mail:</span>
                        <span>{{item.contactEmail}}</span>
                      </li>
                      <li>
                        <span class="strong">Phone:</span>
                        <span>{{item.contactPhone}}</span>
                      </li>
                    </ul>
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
    "ExchangeToolsService"
  ]
})
export default class OrganizationalUnits extends Vue {
  filter = "";
  sortCol = "name";
  dir = "asc";
  records = [];
  originalRecords = [];
  async mounted() {
    this.toastService.set(this);
    await this.initializeRecords();
  }
  async search() {
    //let records = JSON.parse(JSON.stringify(this.records));
    let keys = [
      "name",
      "domain",
      "onyen",
      "department",
      "contactName",
      "contactPhone",
      "contactEmail"
    ];

    this.records = this.records.filter(rec => {
      let val = keys
        .map(
          c =>
            !!rec[c] &&
            rec[c].toUpperCase().indexOf(this.filter.toUpperCase()) > -1
        )
        .some(c => c === true);

      return val;
    });

   
  }
  clear() {
    this.filter = "";
    this.records = this.originalRecords;
    this.dir = this.dir === "asc" ? "desc" : "asc";

    this.sort(this.sortCol);
  }

  async initializeRecords() {
    this.spinnerService.show();
    try {
      let records = await this.ExchangeToolsService.getOrganizationalUnitsAdmins();
      let col = this.sortCol;
      let dir = this.dir === "asc" ? -1 : 1;
      this.records = records.sort((a, b) => {
        if (a[col].toUpperCase() < b[col].toUpperCase()) return dir;
        if (a[col].toUpperCase() > b[col].toUpperCase()) return dir * -1;
        return 0;
      });
      this.originalRecords = this.records;
    } catch (e) {
      window.console.log(e);
      this.toastService.error("Failed to retrieve records");
    } finally {
      this.spinnerService.hide();
    }
  }

  sort(name) {
    let col = this.sortCol;
    let dir = this.dir === "asc" ? -1 : 1;
    this.sortCol = name;
    this.records.sort(() => {
      switch (name) {
        case "name":
          if (col === "name") dir = dir * -1;
          col = "name";
          break;
        case "domain":
          if (col === "domain") dir = dir * -1;
          col = "domain";
          break;
        case "onyen":
          if (col === "onyen") dir = dir * -1;
          col = "onyen";
          break;
        case "department":
          if (col === "department") dir = dir * -1;
          col = "department";
          break;
      }
      this.dir = dir === -1 ? "asc" : "desc";
      this.sortCol = col;
      let records = JSON.parse(JSON.stringify(this.records));

      this.records = records.sort((a, b) => {
        if (a[col].toUpperCase() < b[col].toUpperCase()) return dir;
        if (a[col].toUpperCase() > b[col].toUpperCase()) return dir * -1;
        return 0;
      });
    });
  }
}
</script>
<style lang="scss" scoped>
.row {
  margin: auto;
}
.row-header {
  margin-top: 20px;
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
.entity-info:nth-of-type(even) {
  background: $white;
}





</style>
