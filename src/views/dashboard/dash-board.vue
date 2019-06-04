<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">dashboard</i>
        </div>
        <h3>Dashboard</h3>
      </div>
      <div class="card-body dashboard-widgets">
        <gal-sync-widget></gal-sync-widget>
        <provisions-widget></provisions-widget>
        <ad-lock-widget></ad-lock-widget>
        <bearer-token-widget></bearer-token-widget>
      </div>
    </div>
  </div>
</template>
<script src="./dash-board.js"></script>
<style lang="scss" src="./dash-board.scss" ></style>
