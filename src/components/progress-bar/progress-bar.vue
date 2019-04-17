<template>
  <div>
    <div class="progress">
      <div
        class="progress-bar progress-bar-striped"
        role="progressbar"
        :style="{width: width + '%'}"
        :aria-valuenow="width"
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
    <p>{{statusText}}</p>
  </div>
</template>
<script src="./progress-bar.js"></script>
<style lang="scss" src="./progress-bar.scss" scoped></style>
