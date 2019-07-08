<template>
  <div class="top-header">
    <div class="logo"></div>
    <div class="site-title">
      <div class="title-content">
          <a href="#" @click.prevent="signOut()">
            <div class="user-info">
            {{name}}

            <i class="fa fa-sign-out-alt"></i>
            </div>
          </a>
        <h2>ITS Workgroup Services</h2>
        <h1>Self Service</h1>
        <h3>Active Directory, Office365, HeelMail, Listserv, MassMail</h3>
        <div class="burger-section">
          
          <button class="btn btn-primary pt-2 px-2 pb-0 " @click="showSideMenu()">
            <i class="material-icons">
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
