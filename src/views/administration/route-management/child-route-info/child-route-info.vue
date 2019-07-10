<template>
  
    <div class="border border-secondary">
      
      <div class="row bg-secondary text-white row-header m-0">
        <div class="col">
          <span>Id</span>
        </div>
        <div class="col">
          <span>Name</span>
        </div>
        <div class="col">
          <span>Enabled</span>
        </div>
        <div class="col"></div>
      </div>
      <!-- Header Cols -->
      <!-- Record Results -->
      <div class="container">

      
      <div class="row result-grid" v-for="(item, index) in entities" v-bind:key="index">
        <div>
          <div class="col">{{item.id}}</div>
          <div class="col">{{item.name}}</div>
          <div class="col">{{item.enabled | toEnabledDisabled}}</div>
          <div class="col text-right">
            <a href="#" @click.prevent="toggleShowChildren(item)" class="">
              <i
                class="fa fa-angle-double-down more-info"
                :class="{expanded: item.expanded, collapsed: item.expanded === false}"
              ></i>
            </a>
          </div>
          <div class="entity-details">
            <transition name="expand">
              <div class="entity-details-data" v-if="item.expanded">
                <route-info :model="item"></route-info>
              </div>
            </transition>
          </div>
        </div>
      </div>
</div>
      <!-- Record Results -->
    </div>
  
</template>
<script src="./child-route-info.js"></script>
<style lang="scss" src="./child-route-info.scss" scoped></style>
