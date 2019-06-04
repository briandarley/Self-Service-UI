<template>
  <div class="card widget">
    <spinner allow-service-update="false" ref="spinner"></spinner>
    <div class="card-header bg-primary text-white ct-chart provisions-today"></div>
    <div class="card-body">
      <div class="text-center">Email Provisions for Week of</div>
      <div class="navigate">
        <a href="#"  @click.prevent="previous()">
          <i class="fa fa-caret-square-left"></i>
        </a>
        {{provisionsDate | formatDate}}
        <a
          href="#"
          :class="{'max-date': isMaxDate}"
          :disabled="isMaxDate"
          @click.prevent="next()"
        >
          <i class="fa fa-caret-square-right"></i>
        </a>
      </div>
      <span></span>
    </div>
    
  </div>
</template>
<script src="./provisions-widget.js"></script>
<style lang="scss" src="./provisions-widget.scss"></style>
