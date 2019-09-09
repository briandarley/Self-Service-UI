<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">ballot</i>
        </div>
        <h3>Resources</h3>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fas fa-info-circle" aria-hidden="true"></i>
          </div>
          <div>
            <p>Search system for accounts with OWA resource access.</p>
          </div>
        </div>
        <form @submit.prevent.prevent class="container" role="form" ref="submitForm">
          <div class="form-group">
            <div class="label-info">
              <label for="searchField">User Onyen</label>
              <span class="required">Required</span>
            </div>
            <input
              type="text"
              id="searchField"
              class="form-control"
              v-select-all
              v-model="filter"
              placeholder="onyen"
              data-validation="{'required': 'true', 'message': 'Search field required'}"
              ref="searchField"
              v-on:keyup.13="search()"
              autocomplete="off"
            />
          </div>

          <div class="submit text-right mt-3">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
        </form>

        <div class="bg-primary text-white row-header" v-if="resources.length">
          <div class="col">Resource Name</div>
        </div>
        <div class="list-container" v-if="resources.length">
          <div class="result-grid" v-for="(item, index) in resources" :key="index">
            <div class="col">
              <a :href="'https://outlook.unc.edu/owa/' + item" target="_blank">{{item}}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./resources.js"></script>
<style lang="scss" src="./resources.scss" scoped></style>
