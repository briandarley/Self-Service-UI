<template>
  <div class="container">
    <div class="card card-icon">
      <div class="card-header text-primary">
        <div class="icon bg-primary text-white">
          <i class="material-icons">home</i>
        </div>
        <h3>Self Service Home</h3>
        
        
        </div>
      <div class="card-body">
        <p>
          Welcome to the ITS Email Self Service Site. Use the buttons on this site to perform
          actions such as creating an email account, requesting an alias or automating calendar events.
          Some users will get an Exchange account and some will get a Heelmail account.
        </p>

        <button class="btn btn-primary" v-on:click="click()">test</button>

        <div class="user-actions">
          <div class="action">
            <router-link :to="{name: 'emailsignup'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="material-icons">email</i>
                <span>Email Sign-Up</span>
              </a>
            </router-link>
          </div>
          <div class="action">
            <router-link :to="{name: 'listserv-subscriptions'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="material-icons">subscriptions</i>
                <span>Listserv Subscriptions</span>
              </a>
            </router-link>
          </div>
          <div class="action">
            <router-link :to="{name: 'my-aliases'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="material-icons">person_outline</i>
                <span>My Aliases</span>
              </a>
            </router-link>
          </div>
          <div class="action">
            <router-link :to="{name: 'my-ad-groups'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="material-icons">group_work</i>
                <span>My AD Groups</span>
              </a>
            </router-link>
          </div>
          <div class="action">
            <router-link :to="{name: 'my-resources'}">
              <a href="#" class="btn btn-outline-primary">
                <i class="fa fa-book"></i>
                <span>My Resources</span>
              </a>
            </router-link>
          </div>
        </div>
      </div>
    </div>

  
  </div>
</template>
<script src="./home.js"></script>
<style lang="scss" src="./home.scss" scoped></style>
