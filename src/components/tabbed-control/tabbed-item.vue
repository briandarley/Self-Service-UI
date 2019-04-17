<template>
  <div class="tab-pane container" v-bind:class="{active: isActive}">
    <slot></slot>
  </div>
</template>
<script src="./tabbed-item.js"></script>
