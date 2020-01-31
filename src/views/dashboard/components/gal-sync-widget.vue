<template>
  <div 
    class="card widget" 
    role="timer" 
    title="The next expected network sync with Azure AD">
    <spinner allow-service-update="false" ref="spinner"></spinner>
    <div class="card-header bg-primary text-white">
      <h4>Next GAL Sync</h4>
    </div>
    <div class="card-body display-gal-sync">
      <p class="text-primary">{{nextGalSync}}</p>
    </div>
    
  </div>
  
</template>
<script src="./gal-sync-widget.js"></script>
<style lang="scss" src="./gal-sync-widget.scss" scoped></style>
