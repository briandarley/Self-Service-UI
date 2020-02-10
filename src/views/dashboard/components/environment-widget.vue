<template>
  <div class="card widget">
    <div class="card-header bg-primary text-white ct-chart provisions-today">
      <h2>Environment</h2>
    </div>
    <div class="container environment-data">
      <div>
        <span class="label">Environment: </span>
        <span>{{environment}}</span>
      </div>
      <div>
        <span class="label">Build: </span>
        <span>{{build}}</span>
      </div>
    </div>
  </div>
</template>

<script src="./environment-widget.js"></script>
<style lang="scss" src="./environment-widget.scss" scoped></style>
