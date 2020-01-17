<template>
  <div class="top-header" role="banner">
    <div class="logo"></div>
    <div class="site-title">
      <div class="title-content">
          <a href="#" @click.prevent="signOut()">
            <div class="user-info">
            {{name}}

            <i class="fa fa-sign-out-alt" aria-hidden="true"></i>
            </div>
          </a>
        <span class="h1">Self Service</span>          
        <span class="h2">ITS Workgroup Services</span>
        <span class="h3">Active Directory, Office365, HeelMail, Listserv, MassMail</span>
        <div class="burger-section">
          
          <button class="btn btn-primary pt-2 px-2 pb-0 " @click="showSideMenu()">
            <i class="material-icons" aria-hidden="true">
              dehaze
            </i>
          </button>
        </div>
      </div>
    </div>
    


  </div>
</template>
<script src="./top-header.js"></script>
<style lang="scss" src="./top-header.scss" scoped></style>
