<template>
  <div class="card widget">
    <spinner allow-service-update="false" ref="spinner"></spinner>
    <div class="card-header bg-danger text-white ct-chart ad-lockouts-today">
      <h4 class="hide">AD Lock Outs</h4>
    </div>
    <div class="card-body">
      <div class="widget-nav">
        <div class="col">
          <a 
            href="#" 
            @click.prevent="previous()" 
            title="previous day"
            >
            <i class="fa fa-caret-square-left" aria-hidden="true"></i>
            <span>Previous Day</span>
          </a>
        </div>
        <div class="col">
          <span>AD Lock Outs {{currentDate | formatDate}}</span>
        </div>
        <div class="col">
          <a 
          href="#" 
          :class="{'max-date': isMaxDate}" 
          :disabled="isMaxDate" 
          @click.prevent="next()" 
          title="next day"
          :aria-disabled="isMaxDate">
          <i class="fa fa-caret-square-right" aria-hidden="true"></i>
          <span>Next Day</span>
        </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./ad-lock-widget.js"></script>
<style lang="scss" src="./ad-lock-widget.scss" scoped></style>
