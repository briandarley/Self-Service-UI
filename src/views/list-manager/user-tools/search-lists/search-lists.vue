<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">image_search</i>
        </div>
        <h1>Search Lists</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent.prevent class="container" role="form" ref="searchForm">
          <div class="form-group">
            <div class="label-info">
                <label for="searchField" id="lblSearchField">Search Lists by Name (Name Like)</label>
                <span class="required" id="spnSearchFieldReq">Required</span>
              </div>
            <input
              type="text"
              id="searchField"
              name="searchField"
              class="form-control"
              v-model="nameLike"
              v-select-all
              placeholder="name like"
              data-validation="{'required': 'true', 'message': 'Search field required'}"
              ref="searchField"
              v-on:keyup.13="search()"
              aria-labelledby="lblSearchField spnSearchFieldReq"
              autocomplete="off"
                
            />
          </div>
          <div class="submit text-right">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
          <div v-if="data.length" class="my-3 mt-5">
            <span class="h5 text-primary">Total Records: {{data.length|formatNumber}}</span>
          </div>
          <div class="search-results" v-if="data.length" role="table">
            <div class="bg-primary text-white row-header" role="rowheader">
              <div class="col" role="columnheader" aria-sort="none">List Name</div>
              <div class="col" role="columnheader"  aria-sort="none">Description</div>
              <div class="col" role="columnheader"  aria-sort="none"></div>
            </div>
            <div class="results" role="rowgroup">
              <div class="result-grid" v-for="item in data" :key="item.listName" role="row">
                <div class="col" role="cell">{{item.listName}}</div>
                <div class="col" role="cell">{{item.description}}</div>
                <div class="col" role="cell">
                  <a :href="basePath + 'read/?forum=' + item.listName" target="_blank" :aria-label="'visit list site, opens new tab and navigate to Lyris List ' + item.listName">Visit</a>
                  <a
                    :href="basePath + 'read/all_forums/subscribe?name=' + item.listName"
                    target="_blank"
                    :aria-label="'subscribe to list, opens new tab and navigate to Lyris List ' + item.listName + ' to subscribe'"
                  >Subscribe</a>
                </div>
              </div>
            </div>

            
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script src="./search-lists.js"></script>
<style lang="scss" src="./search-lists.scss" scoped></style>
