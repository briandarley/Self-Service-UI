<template>
  <div class="container-fluid app-container">
  <div id="announcer" class="screen-reader-hide" aria-live="polite"></div>
    <top-header></top-header>
    <div class="main-app-section">
      <side-menu></side-menu>
      <div class="app-section" role="main">
        <transition name="fade">
          <router-view/>
        </transition>
        <spinner id="appSpinner"></spinner>
      </div>
    </div>
    <site-footer></site-footer>
    <spinner id="mainSpinner" ref="mainSpinner" :allow-service-update="false"></spinner>
  </div>
</template>

<script src="./app.js"></script>
<style lang="scss" src="./app.scss"></style>
