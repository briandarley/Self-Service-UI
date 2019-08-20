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

        <div class="bg-primary text-white row-header">
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
