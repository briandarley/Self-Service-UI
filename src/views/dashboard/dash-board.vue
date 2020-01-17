<template>
  <div class="container" >
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons" aria-hidden="true">dashboard</i>
        </div>
        <h1>Dashboard</h1>
      </div>
      <div class="card-body dashboard-widgets">
        <gal-sync-widget></gal-sync-widget>
        <provisions-widget></provisions-widget>
        <ad-lock-widget></ad-lock-widget>
        <bearer-token-widget></bearer-token-widget>
        <environment-widget></environment-widget>



        <!-- <button class="btn btn-primary" @click="test()">Test</button> -->
      </div>
    </div>
  </div>
</template>
<script src="./dash-board.js"></script>
<style lang="scss" src="./dash-board.scss" ></style>
