<template>
  <div class="container-fluid app-container">
    <top-header></top-header>
    <div class="main-app-section">
      <side-menu></side-menu>
      <div class="app-section" >
        <transition name="fade">
          <router-view/>
        </transition>
        <spinner></spinner>
      </div>
    </div>
    <site-footer></site-footer>
    <spinner ref="mainSpinner"></spinner>
  </div>
</template>

<script src="./app.js"></script>
<style lang="scss" src="./app.scss"></style>
