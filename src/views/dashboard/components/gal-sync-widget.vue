<template>
  <div class="card widget">
    <spinner allow-service-update="false" ref="spinner"></spinner>
    <div class="card-header bg-primary text-white">
      <p>Next GAL Sync</p>
    </div>
    <div class="card-body display-gal-sync">
      <p class="text-primary">{{nextGalSync}}</p>
    </div>
  </div>
</template>
<script src="./gal-sync-widget.js"></script>
<style lang="scss" src="./gal-sync-widget.scss" scoped></style>
