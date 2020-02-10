<template>
  <div class="card widget" role="grid" title="E-mail provision counts for given week">
    <spinner allow-service-update="false" ref="spinner"></spinner>
    <div class="card-header bg-primary text-white ct-chart provisions-today">
       <h2 class="hide">Email Provision Requests</h2>
    </div>
    <div class="card-body">
      <div class="widget-nav">
        <div class="col">
          <a href="#" @click.prevent="previous()" title="previous week" role="navigation">
            <i class="fa fa-caret-square-left" aria-hidden="true"></i>
            <span>Previous Week</span>
          </a>
        </div>
        <div class="col"><span>Email Provisions for Week of {{provisionsDate | formatDate}}</span></div>
        <div class="col">
          <a
            href="#"
            title="next week"
            :class="{'max-date': isMaxDate}"
            :disabled="isMaxDate"
            :aria-disabled="isMaxDate"
            @click.prevent="next()"
            role="navigation"
          >
            <i class="fa fa-caret-square-right" aria-hidden="true"></i>
            <span>Next Week</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="./provisions-widget.js"></script>
<style lang="scss" src="./provisions-widget.scss"></style>
