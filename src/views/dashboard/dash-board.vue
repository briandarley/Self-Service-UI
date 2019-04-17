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
        <div class="card widget">
          <div class="card-header bg-primary text-white">
            <p>Next GAL Sync</p>
          </div>
          <div class="card-body display-gal-sync">
            <p class="text-primary">{{nextGalSync}}</p>
          </div>
        </div>

        <div class="card widget" >
          <div class="card-header bg-primary text-white ct-chart provisions-today"></div>
          <div class="card-body">
            <span>Email Provisions for Week of 3/20/2019</span>
          </div>
        </div>

        <div class="card widget" >
          <div class="card-header bg-danger text-white ct-chart ad-lockouts-today"></div>
          <div class="card-body">
            <span>AD Lock Outs</span>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>
<script src="./dash-board.js"></script>
<style lang="scss" src="./dash-board.scss" scoped></style>
