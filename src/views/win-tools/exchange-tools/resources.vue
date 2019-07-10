<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">ballot</i>
        </div>
        <h3>Resources</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="alert alert-info">
            <div class="info">
              <i class="fas fa-info-circle"></i>
            </div>
            <div>
              <p>Search system for accounts with OWA resource access.</p>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for>User Id</label>
          <input
            type="text"
            class="form-control"
            v-select-all
            v-model="filter"
            placeholder="onyen"
            v-on:keyup.13="search()"
          />
        </div>
        <div class="submit text-right">
          <button class="btn btn-primary mr-1" @click="search()">Search</button>
          <button class="btn btn-secondary" @click="clear()">Clear</button>
        </div>

        <div class="container" v-if="resources.length">
          <div class="row bg-primary text-white row-header">
            <div class="col">Resource Name</div>
          </div>
          <div class="row result-grid" v-for="(item, index) in resources" :key="index">
            <div class="col">
              <a :href="'https://outlook.unc.edu/owa/' + item" target="_blank">{{item}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  name: "resources",
  dependencies: [
    "$",
    "toastService",
    "spinnerService",
    "ExchangeToolsService",
    "CommonExtensions"
  ]
})
export default class Resources extends Vue {
  filter = "";
  resources = [];
  async mounted() {
    this.toastService.set(this);
  }

  async search() {
    this.spinnerService.show();
    try {
      this.resources = [];
      let resources = await this.ExchangeToolsService.getResources(this.filter);

      if (resources && resources.status === false) {
        this.toastService.warn("No resources associated with this account");
        return;
      }

      this.resources = resources.sort((a, b) => {
        if (a.toLowerCase() < b.toLowerCase()) {
          return -1;
        }
        if (a.toLowerCase() > b.toLowerCase()) {
          return 1;
        }
        return 0;
      });
    } catch (e) {
      window.console.log(e);
      this.toastService.error(
        "Failed to retrieve resources associated with user"
      );
    } finally {
      this.spinnerService.hide();
    }
  }
  async clear() {
    this.filter = "";
    this.resources = [];
  }
}
</script>
<style lang="scss" scoped>
.row-header {
  margin-top: 20px;
}
</style>
