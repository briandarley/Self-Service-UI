<template>
  <div class="card widget">
    <spinner allow-service-update="false" ref="spinner"></spinner>
    <div class="card-header bg-danger text-white ct-chart ad-lockouts-today"></div>
    <div class="card-body">
      
      <div class="text-center">AD Lock Outs</div>
      <div class="navigate">
        <a href="#"  @click.prevent="previous()">
          <i class="fa fa-caret-square-left"></i>
        </a>
        {{currentDate | formatDate}}
        <a
          href="#"
          :class="{'max-date': isMaxDate}"
          :disabled="isMaxDate"
          @click.prevent="next()"
        >
          <i class="fa fa-caret-square-right"></i>
        </a>
      </div>
    </div>
  </div>
</template>
<script src="./ad-lock-widget.js"></script>
<style lang="scss" src="./ad-lock-widget.scss" scoped></style>
