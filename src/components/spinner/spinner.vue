<template>
  <!-- v-if="processing"  -->
    <div class="spinner" ref="spinner" :class="{'hidden': !processing}" :id="id">
      <div class="spinner-container">
        <div class="fulfilling-bouncing-circle-spinner">
          <div class="circle"></div>
          <div class="orbit"></div>
        </div>
      </div>
    </div>
  
</template>
<script src="./spinner.js"></script>
<style lang="scss" src="./spinner.scss" scoped></style>
