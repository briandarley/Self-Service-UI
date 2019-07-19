<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">group_work</i>
        </div>
        <h3>My AD Groups</h3>
      </div>
      <div class="card-body">
        <div class="alert alert-info">
          <div class="info">
            <i class="fa fa-info-circle"></i>
          </div>
          <p class="ml-4">View All AD groups in which you are a member of</p>
        </div>
        <div class="section">
          <div class="container mb-3" v-if="entities.length">
            <h3 class="text-primary">Total {{entities.length | formatNumber}}</h3>

            <div class="row bg-primary text-white row-header">
              <div class="col">Group Name</div>
              
            </div>
            <div class="result-grid row" v-for="item in entities" v-bind:key="item">
              <div class="col">{{item}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./my-ad-groups.js"></script>
<style lang="scss" src="./my-ad-groups.scss" scoped></style>
