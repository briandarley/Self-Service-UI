<template>
  <div class="container-fluid app-container">
    <div id="announcer" class="screen-reader-hide" aria-live="polite"></div>

    <top-header></top-header>
    <div
      class="main-app-section"
      :class="{ 'main-app-section-collapsed': sideBarCollapsed }"
    >
      <side-menu :collapsed="sideBarCollapsed"></side-menu>

      <div class="app-section" role="main">
        <div class="ml-2 mt-2 toggle-menu-btn-cntr" >
          <button
          class="btn btn-primary toggle-menu-btn"
          @click="toggleMenu()"
        >
          <i class="fa fa-bars"></i>
          <span class="ml-2" v-if="sideBarCollapsed">
            Maximize Menu
          </span>
          <span class="ml-2" v-else>
            Minimize Menu
          </span>
        </button>
        </div>
        <group-create-status></group-create-status>
        <transition name="fade">
          <router-view />
        </transition>
        
        <spinner id="appSpinner"></spinner>
      </div>
      
    </div>
    <site-footer></site-footer>
    
    <spinner
      id="mainSpinner"
      ref="mainSpinner"
      :allow-service-update="false"
    ></spinner>
    
  </div>
</template>

<script src="./app.js"></script>
<style lang="scss" src="./app.scss"></style>
