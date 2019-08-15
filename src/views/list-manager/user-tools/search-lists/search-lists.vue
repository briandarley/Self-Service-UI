<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">image_search</i>
        </div>
        <h3>Search Lists</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <div class="form-group">
            <input type="text" 
            class="form-control" 
            v-model="nameLike" 
            v-select-all 
            placeholder="name like" 
            v-on:keyup.13="search()">
            
          </div>
          <div class="submit text-right">
            <button class="btn btn-primary mr-1" @click="search()">Search</button>
            <button class="btn btn-secondary" @click="clear()">Clear</button>
          </div>
          <div v-if="data.length" class="my-3 mt-5">
            <span class="h5 text-primary">Total Records: {{data.length|formatNumber}}</span>
          </div>
          <div class="search-results" v-if="data.length">
              <div v-for="item in data" :key="item.listName">
                  <span>{{item.listName}}</span>
                  <span>{{item.description}}</span>
                  <div>
                    <a :href="basePath + 'read/?forum=' + item.listName" target="_blank">Visit</a>
                    <a :href="basePath + 'read/all_forums/subscribe?name=' + item.listName" target="_blank">Subscribe</a>
                  </div>

              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./search-lists.js"></script>
<style lang="scss" src="./search-lists.scss" scoped></style>
